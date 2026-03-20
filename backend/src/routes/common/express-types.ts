import { Request, Response } from 'express';

type UrlParams = Record<string, string>;

export type Req = Request<UrlParams, void, any>;
export type Res = Response;
