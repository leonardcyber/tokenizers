import { PostProcessor } from "../../../bindings/post-processors";
import { AddedToken, EncodeInput, EncodeOptions, InputSequence, PaddingConfiguration, PaddingOptions, Tokenizer, TruncationConfiguration, TruncationOptions } from "../../../bindings/tokenizer";
import { Encoding } from "../encoding";
export declare type Token = string | AddedToken;
export declare class BaseTokenizer<TConfig extends object> {
    protected tokenizer: Tokenizer;
    /**
     * @since 0.4.0
     */
    readonly configuration: Readonly<TConfig>;
    private _truncation?;
    private _padding?;
    constructor(tokenizer: Tokenizer, 
    /**
     * @since 0.4.0
     */
    configuration: Readonly<TConfig>);
    /**
     * Instantiate a new Tokenizer from the given file
     * @param path Path to a file containing a Tokenizer
     */
    static fromFile: typeof Tokenizer.fromFile;
    /**
     * Instantiate a new Tokenizer from the given JSON string
     * @param s A JSON string representation of the Tokenizer
     */
    static fromString: typeof Tokenizer.fromString;
    /**
     * Truncation configuration if enabled, `null` otherwise.
     *
     * @see {@link BaseTokenizer#setTruncation} to change truncation configuration
     * @see {@link BaseTokenizer#disableTruncation} to disable truncation
     * @since 0.4.0
     */
    get truncation(): Readonly<TruncationConfiguration> | null;
    /**
     * Padding configuration if enabled, `null` otherwise
     *
     * @see {@link BaseTokenizer#setPadding} to change padding configuration
     * @see {@link BaseTokenizer#disablePadding} to disable padding
     * @since 0.4.0
     */
    get padding(): Readonly<PaddingConfiguration> | null;
    /**
     * Add the given tokens to the vocabulary
     *
     * @param tokens A list of tokens to add to the vocabulary.
     * Each token can either be a string, or an instance of AddedToken.
     */
    addTokens(tokens: Token[]): number;
    /**
     * Add the given special tokens to the vocabulary, and treat them as special tokens.
     * The special tokens will never be processed by the model, and will be removed while decoding.
     *
     * @param tokens The list of special tokens to add.
     * Each token can either be a string, or an instance of AddedToken
     * @returns The number of tokens that were added to the vocabulary
     */
    addSpecialTokens(tokens: Token[]): number;
    /**
     * Encode the given sequence
     *
     * @param sequence The sequence to encode
     * @param [pair] The optional pair sequence
     * @param [options] Some options to customize the encoding
     */
    encode(sequence: InputSequence, pair?: InputSequence, options?: EncodeOptions): Promise<Encoding>;
    /**
     * Encode the given sequences or pair of sequences
     *
     * @param sequences A list of sequences or pair of sequences.
     * The list can contain both at the same time.
     * @param [options] Sope options to customize the encoding
     */
    encodeBatch(sequences: EncodeInput[], options?: EncodeOptions): Promise<Encoding[]>;
    /**
     * Decode the given list of ids to a string sequence
     *
     * @param ids A list of ids to be decoded
     * @param [skipSpecialTokens=true] Whether to remove all the special tokens from the output string
     */
    decode(ids: number[], skipSpecialTokens?: boolean): Promise<string>;
    /**
     * Decode the list of sequences to a list of string sequences
     *
     * @param sequences A list of sequences of ids to be decoded
     * @param [skipSpecialTokens=true] Whether to remove all the special tokens from the output strings
     */
    decodeBatch(ids: number[][], skipSpecialTokens?: boolean): Promise<string[]>;
    /**
     * Enable/change truncation with specified options
     *
     * @param maxLength The maximum length at which to truncate
     * @param [options] Additional truncation options
     * @returns Full truncation configuration
     */
    setTruncation(maxLength: number, options?: TruncationOptions): Readonly<TruncationConfiguration>;
    /**
     * Disable truncation
     */
    disableTruncation(): void;
    /**
     * Enable/change padding with specified options
     * @param [options] Padding options
     * @returns Full padding configuration
     */
    setPadding(options?: PaddingOptions): Readonly<PaddingConfiguration>;
    /**
     * Disable padding
     */
    disablePadding(): void;
    /**
     * Convert the given token id to its corresponding string
     *
     * @param id The token id to convert
     * @returns The corresponding string if it exists
     */
    idToToken(id: number): string | undefined;
    /**
     * Convert the given token to its corresponding id
     *
     * @param token The token to convert
     * @returns The corresponding id if it exists
     */
    tokenToId(token: string): number | undefined;
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
    postProcess(encoding: Encoding, pair?: Encoding, addSpecialTokens?: boolean): Encoding;
    /**
     * Change the post-processor to use with this Tokenizer
     * @param postProcessor New post-processor to use
     * @throws Will throw an error if any task is running
     * @throws Will throw an error if the post-processor is already used in another Tokenizer
     */
    setPostProcessor(processor: PostProcessor): void;
    /**
     * Save the Tokenizer as JSON to the given path
     * @param path Path to the JSON file to write
     * @param [pretty=false] Whether the JSON string should be prettified
     */
    save(path: string, pretty?: boolean): void;
    /**
     * Get a serialized JSON version of the Tokenizer as a string
     * @param [pretty=false] Whether the JSON string should be prettified
     */
    toString(pretty?: boolean): string;
}
/**
 * Get the string content from a token, which can be a string or AddedToken
 * @param token The token from which get the content
 */
export declare function getTokenContent(token: Token): string;
