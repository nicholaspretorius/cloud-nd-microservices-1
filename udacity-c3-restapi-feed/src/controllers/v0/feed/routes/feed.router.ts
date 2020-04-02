import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../../../aws';
import * as c from '../../../../config/config';

const imageUrlPrefix = `https://${c.config.dev.aws_media_bucket}.s3.${c.config.dev.aws_region}.amazonaws.com`

const router: Router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    //   return next();
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }


    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];
    return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
    await items.rows.map(async (item) => {
        if (item.url) {
            item.url = await AWS.getGetSignedUrl(item.url.split("?")[0]);
        }
    });
    res.send(items);
});

// Get a specific resource
router.get('/:id',
    async (req: Request, res: Response) => {
        let { id } = req.params;
        const item = await FeedItem.findByPk(id);
        res.send(item);
    });

// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        res.send(500).send("not implemented")
    });


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
        let { fileName } = req.params;
        try {
            const url = await AWS.getPutSignedUrl(fileName);
            return res.status(201).send({ url: url });
        } catch (e) {
            console.log("Error with signing url: ", { e });
            return res.status(400).send({ error: e });
        }
    });

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url;

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        }

        // check Filename is valid
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        }

        const item = await new FeedItem({
            caption: caption,
            url: `${imageUrlPrefix}/${fileName}`
        });

        const saved_item = await item.save();

        res.status(201).send(saved_item);
    });

export const FeedRouter: Router = router;