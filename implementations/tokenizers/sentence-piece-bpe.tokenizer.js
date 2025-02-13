"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentencePieceBPETokenizer = void 0;
const util_1 = require("util");
const decoders_1 = require("../../bindings/decoders");
const models_1 = require("../../bindings/models");
const normalizers_1 = require("../../bindings/normalizers");
const pre_tokenizers_1 = require("../../bindings/pre-tokenizers");
const tokenizer_1 = require("../../bindings/tokenizer");
const trainers_1 = require("../../bindings/trainers");
const base_tokenizer_1 = require("./base.tokenizer");
/**
 * Represents the BPE algorithm, with the pretokenization used by SentencePiece
 */
class SentencePieceBPETokenizer extends base_tokenizer_1.BaseTokenizer {
    constructor(tokenizer, configuration) {
        super(tokenizer, configuration);
        this.defaultTrainOptions = {
            initialAlphabet: [],
            limitAlphabet: 1000,
            minFrequency: 2,
            showProgress: true,
            specialTokens: ["<unk>"],
            vocabSize: 30000,
        };
    }
    static async fromOptions(options) {
        const opts = Object.assign(Object.assign({}, this.defaultOptions), options);
        const unkToken = base_tokenizer_1.getTokenContent(opts.unkToken);
        let model;
        if (opts.vocabFile && opts.mergesFile) {
            const modelOptions = {
                dropout: opts.dropout,
                unkToken: unkToken,
            };
            const fromFile = util_1.promisify(models_1.BPE.fromFile);
            model = await fromFile(opts.vocabFile, opts.mergesFile, modelOptions);
        }
        else {
            model = models_1.BPE.empty();
        }
        const tokenizer = new tokenizer_1.Tokenizer(model);
        if (tokenizer.tokenToId(unkToken) !== undefined) {
            tokenizer.addSpecialTokens([opts.unkToken]);
        }
        tokenizer.setNormalizer(normalizers_1.nfkcNormalizer());
        const preTokenizer = pre_tokenizers_1.metaspacePreTokenizer(opts.replacement, opts.addPrefixSpace);
        tokenizer.setPreTokenizer(preTokenizer);
        const decoder = decoders_1.metaspaceDecoder(opts.replacement, opts.addPrefixSpace);
        tokenizer.setDecoder(decoder);
        return new SentencePieceBPETokenizer(tokenizer, opts);
    }
    /**
     * Train the model using the given files
     *
     * @param files Files to use for training
     * @param [options] Training options
     */
    async train(files, options) {
        const mergedOptions = Object.assign(Object.assign({}, this.defaultTrainOptions), options);
        const trainer = trainers_1.bpeTrainer(mergedOptions);
        this.tokenizer.train(trainer, files);
    }
}
exports.SentencePieceBPETokenizer = SentencePieceBPETokenizer;
SentencePieceBPETokenizer.defaultOptions = {
    addPrefixSpace: true,
    replacement: "▁",
    unkToken: "<unk>",
};
