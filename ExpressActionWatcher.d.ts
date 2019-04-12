import express = require("express")
import { AbstractActionHandler } from './AbstractActionHandler';
import { AbstractActionReader } from './AbstractActionReader';
import { BaseActionWatcher } from './BaseActionWatcher';
/**
 * Exposes the BaseActionWatcher's API methods through a simple REST interface using Express
 */
export declare class ExpressActionWatcher extends BaseActionWatcher {
    protected actionReader: AbstractActionReader;
    protected actionHandler: AbstractActionHandler;
    protected pollInterval: number;
    protected port: number;
    /**
     * @param port  The port to use for the Express server
     */
    express: express.Express;
    private server;
    constructor(actionReader: AbstractActionReader, actionHandler: AbstractActionHandler, pollInterval: number, port: number);
    /**
     * Start the Express server
     */
    listen(): Promise<boolean>;
    /**
     * Close the Express server
     */
    close(): Promise<boolean>;
}
