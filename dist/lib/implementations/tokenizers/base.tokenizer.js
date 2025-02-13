"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenContent = exports.BaseTokenizer = void 0;
const util_1 = require("util");
const tokenizer_1 = require("../../../bindings/tokenizer");
const encoding_1 = require("../encoding");
// eslint-disable-next-line @typescript-eslint/ban-types
class BaseTokenizer {
    constructor(tokenizer, 
    /**
     * @since 0.4.0
     */
    configuration) {
        this.tokenizer = tokenizer;
        this.configuration = configuration;
    }
    /**
     * Truncation configuration if enabled, `null` otherwise.
     *
     * @see {@link BaseTokenizer#setTruncation} to change truncation configuration
     * @see {@link BaseTokenizer#disableTruncation} to disable truncation
     * @since 0.4.0
     */
    get truncation() {
        var _a;
        return (_a = this._truncation) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Padding configuration if enabled, `null` otherwise
     *
     * @see {@link BaseTokenizer#setPadding} to change padding configuration
     * @see {@link BaseTokenizer#disablePadding} to disable padding
     * @since 0.4.0
     */
    get padding() {
        var _a;
        return (_a = this._padding) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Add the given tokens to the vocabulary
     *
     * @param tokens A list of tokens to add to the vocabulary.
     * Each token can either be a string, or an instance of AddedToken.
     */
    addTokens(tokens) {
        return this.tokenizer.addTokens(tokens);
    }
    /**
     * Add the given special tokens to the vocabulary, and treat them as special tokens.
     * The special tokens will never be processed by the model, and will be removed while decoding.
     *
     * @param tokens The list of special tokens to add.
     * Each token can either be a string, or an instance of AddedToken
     * @returns The number of tokens that were added to the vocabulary
     */
    addSpecialTokens(tokens) {
        return this.tokenizer.addSpecialTokens(tokens);
    }
    /**
     * Encode the given sequence
     *
     * @param sequence The sequence to encode
     * @param [pair] The optional pair sequence
     * @param [options] Some options to customize the encoding
     */
    async encode(sequence, pair, options) {
        const encode = util_1.promisify(this.tokenizer.encode.bind(this.tokenizer));
        const rawEncoding = await encode(sequence, pair !== null && pair !== void 0 ? pair : null, options !== null && options !== void 0 ? options : null);
        return new encoding_1.Encoding(rawEncoding);
    }
    /**
     * Encode the given sequences or pair of sequences
     *
     * @param sequences A list of sequences or pair of sequences.
     * The list can contain both at the same time.
     * @param [options] Sope options to customize the encoding
     */
    async encodeBatch(sequences, options) {
        const encodeBatch = util_1.promisify(this.tokenizer.encodeBatch.bind(this.tokenizer));
        const rawEncodings = await encodeBatch(sequences, options);
        return rawEncodings.map((e) => new encoding_1.Encoding(e));
    }
    /**
     * Decode the given list of ids to a string sequence
     *
     * @param ids A list of ids to be decoded
     * @param [skipSpecialTokens=true] Whether to remove all the special tokens from the output string
     */
    decode(ids, skipSpecialTokens = true) {
        const decode = util_1.promisify(this.tokenizer.decode.bind(this.tokenizer));
        return decode(ids, skipSpecialTokens);
    }
    /**
     * Decode the list of sequences to a list of string sequences
     *
     * @param sequences A list of sequences of ids to be decoded
     * @param [skipSpecialTokens=true] Whether to remove all the special tokens from the output strings
     */
    decodeBatch(ids, skipSpecialTokens = true) {
        const decodeBatch = util_1.promisify(this.tokenizer.decodeBatch.bind(this.tokenizer));
        return decodeBatch(ids, skipSpecialTokens);
    }
    /**
     * Enable/change truncation with specified options
     *
     * @param maxLength The maximum length at which to truncate
     * @param [options] Additional truncation options
     * @returns Full truncation configuration
     */
    setTruncation(maxLength, options) {
        const result = this.tokenizer.setTruncation(maxLength, options);
        return (this._truncation = result);
    }
    /**
     * Disable truncation
     */
    disableTruncation() {
        this.tokenizer.disableTruncation();
        delete this._truncation;
    }
    /**
     * Enable/change padding with specified options
     * @param [options] Padding options
     * @returns Full padding configuration
     */
    setPadding(options) {
        const result = this.tokenizer.setPadding(options);
        return (this._padding = result);
    }
    /**
     * Disable padding
     */
    disablePadding() {
        this.tokenizer.disablePadding();
        delete this._padding;
    }
    /**
     * Convert the given token id to its corresponding string
     *
     * @param id The token id to convert
     * @returns The corresponding string if it exists
     */
    idToToken(id) {
        return this.tokenizer.idToToken(id);
    }
    /**
     * Convert the given token to its corresponding id
     *
     * @param token The token to convert
     * @returns The corresponding id if it exists
     */
    tokenToId(token) {
        return this.tokenizer.tokenToId(token);
    }
    /**
     * Apply all the post-processing steps to the given encodings.
     * The various steps are:
     * 1. Truncate according to global params (@see setTruncation)
     * 2. Apply the PostProcessor
     * 3. Pad according to global params (@see setPadding)
     * @param encoding The main Encoding to post process
     * @param [pair] An optional pair Encoding
     * @param [addSpecialTokens=true] Whether to add special tokens. Default to `true`.
     * @since 0.6.0
     */
    postProcess(encoding, pair, addSpecialTokens) {
        const rawEncoding = this.tokenizer.postProcess(encoding.rawEncoding, pair === null || pair === void 0 ? void 0 : pair.rawEncoding, addSpecialTokens);
        return new encoding_1.Encoding(rawEncoding);
    }
    /**
     * Change the post-processor to use with this Tokenizer
     * @param postProcessor New post-processor to use
     * @throws Will throw an error if any task is running
     * @throws Will throw an error if the post-processor is already used in another Tokenizer
     */
    setPostProcessor(processor) {
        return this.tokenizer.setPostProcessor(processor);
    }
    /**
     * Save the Tokenizer as JSON to the given path
     * @param path Path to the JSON file to write
     * @param [pretty=false] Whether the JSON string should be prettified
     */
    save(path, pretty) {
        return this.tokenizer.save(path, pretty);
    }
    /**
     * Get a serialized JSON version of the Tokenizer as a string
     * @param [pretty=false] Whether the JSON string should be prettified
     */
    toString(pretty) {
        return this.tokenizer.toString(pretty);
    }
}
exports.BaseTokenizer = BaseTokenizer;
/**
 * Instantiate a new Tokenizer from the given file
 * @param path Path to a file containing a Tokenizer
 */
BaseTokenizer.fromFile = tokenizer_1.Tokenizer.fromFile;
/**
 * Instantiate a new Tokenizer from the given JSON string
 * @param s A JSON string representation of the Tokenizer
 */
BaseTokenizer.fromString = tokenizer_1.Tokenizer.fromString;
/**
 * Get the string content from a token, which can be a string or AddedToken
 * @param token The token from which get the content
 */
function getTokenContent(token) {
    return typeof token === "string" ? token : token.getContent();
}
exports.getTokenContent = getTokenContent;
//# sourceMappingURL=base.tokenizer.js.map