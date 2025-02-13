"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BertWordPieceTokenizer = void 0;
const util_1 = require("util");
const decoders_1 = require("../../../bindings/decoders");
const models_1 = require("../../../bindings/models");
const normalizers_1 = require("../../../bindings/normalizers");
const post_processors_1 = require("../../../bindings/post-processors");
const pre_tokenizers_1 = require("../../../bindings/pre-tokenizers");
const tokenizer_1 = require("../../../bindings/tokenizer");
const trainers_1 = require("../../../bindings/trainers");
const base_tokenizer_1 = require("./base.tokenizer");
/**
 * Bert WordPiece Tokenizer
 */
class BertWordPieceTokenizer extends base_tokenizer_1.BaseTokenizer {
    constructor(tokenizer, configuration) {
        super(tokenizer, configuration);
        this.defaultTrainOptions = {
            initialAlphabet: [],
            limitAlphabet: 1000,
            minFrequency: 2,
            showProgress: true,
            specialTokens: ["[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]"],
            vocabSize: 30000,
            wordpiecesPrefix: "##",
        };
    }
    /**
     * Instantiate and returns a new Bert WordPiece tokenizer
     * @param [options] Optional tokenizer options
     */
    static async fromOptions(options) {
        const opts = Object.assign(Object.assign({}, this.defaultBertOptions), options);
        let model;
        if (opts.vocabFile) {
            const fromFile = util_1.promisify(models_1.WordPiece.fromFile);
            model = await fromFile(opts.vocabFile, {
                unkToken: base_tokenizer_1.getTokenContent(opts.unkToken),
                continuingSubwordPrefix: opts.wordpiecesPrefix,
            });
        }
        else {
            model = models_1.WordPiece.empty();
        }
        const tokenizer = new tokenizer_1.Tokenizer(model);
        for (const token of [
            opts.clsToken,
            opts.sepToken,
            opts.unkToken,
            opts.padToken,
            opts.maskToken,
        ]) {
            if (tokenizer.tokenToId(base_tokenizer_1.getTokenContent(token)) !== undefined) {
                tokenizer.addSpecialTokens([token]);
            }
        }
        const normalizer = normalizers_1.bertNormalizer(opts);
        tokenizer.setNormalizer(normalizer);
        tokenizer.setPreTokenizer(pre_tokenizers_1.bertPreTokenizer());
        if (opts.vocabFile) {
            const sepTokenId = tokenizer.tokenToId(base_tokenizer_1.getTokenContent(opts.sepToken));
            if (sepTokenId === undefined) {
                throw new Error("sepToken not found in the vocabulary");
            }
            const clsTokenId = tokenizer.tokenToId(base_tokenizer_1.getTokenContent(opts.clsToken));
            if (clsTokenId === undefined) {
                throw new Error("clsToken not found in the vocabulary");
            }
            const processor = post_processors_1.bertProcessing([base_tokenizer_1.getTokenContent(opts.sepToken), sepTokenId], [base_tokenizer_1.getTokenContent(opts.clsToken), clsTokenId]);
            tokenizer.setPostProcessor(processor);
        }
        const decoder = decoders_1.wordPieceDecoder(opts.wordpiecesPrefix);
        tokenizer.setDecoder(decoder);
        return new BertWordPieceTokenizer(tokenizer, opts);
    }
    /**
     * Train the model using the given files
     *
     * @param files Files to use for training
     * @param [options] Training options
     */
    async train(files, options) {
        const mergedOptions = Object.assign(Object.assign({}, this.defaultTrainOptions), options);
        const trainer = trainers_1.wordPieceTrainer(mergedOptions);
        this.tokenizer.train(trainer, files);
    }
}
exports.BertWordPieceTokenizer = BertWordPieceTokenizer;
BertWordPieceTokenizer.defaultBertOptions = {
    cleanText: true,
    clsToken: "[CLS]",
    handleChineseChars: true,
    lowercase: true,
    maskToken: "[MASK]",
    padToken: "[PAD]",
    sepToken: "[SEP]",
    stripAccents: true,
    unkToken: "[UNK]",
    wordpiecesPrefix: "##",
};
//# sourceMappingURL=bert-wordpiece.tokenizer.js.map