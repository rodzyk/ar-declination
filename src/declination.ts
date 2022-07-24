enum OperationEnum {
    Delete = '!',
    Add = '+',
    Replace = '/',
}
interface IOperation {
    operation: OperationEnum;
    value: string;
}

export class Declination {
    private readonly DECLINATION_STRING_PATTERN: string = '^([\\d]+)?([\\wA-яїЇіІґҐ]+)([,\\!\\+\\/\\wA-яїЇіІґҐ]+)$';
    private readonly DECLINATION_PARAMS_PATTERN: string = '([\\/\\!\\+])([\\wA-яїЇіІґҐ]+)';

    _сases: number[] = [2, 0, 1, 1, 1, 2];
    _titles: string[] = ['', '', ''];

    number!: number;
    nominativeCase!: string;
    nominativeCasePlural!: string;
    genitiveCasePlural!: string;
    /**
     *
     * @param str Special string: 32Хвилина!а+и,!а
     */
    constructor(str: string) {
        this.initByParce(str);
    }

    /**
     * Parce Special string
     *
     * @param  str Special string: 32Хвилина!а+и,!а
     */
    private parce(str: string) {
        const regex: RegExp = new RegExp(this.DECLINATION_STRING_PATTERN);
        const m: RegExpExecArray | null = regex.exec(str);

        if (!m || m.length < 4) throw new Error('Parce error');

        const parcedNumb = parseInt(m[1], 10);
        const numb = isNaN(parcedNumb) || undefined ? 0 : parcedNumb;
        const baseWord = m[2];
        const params = m[3].split(',');

        return { numb, baseWord, params };
    }

    private parceParams(str: string): IOperation[] {
        const regex = new RegExp(this.DECLINATION_PARAMS_PATTERN, 'g');
        let m: RegExpExecArray | null = null;
        const operations: IOperation[] = [];

        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const operation: OperationEnum = m[1] as OperationEnum;
            const value: string = m[2];
            operations.push({ operation, value });
        }

        return operations;
    }

    runOperation(baseWord: string, operations: IOperation[]) {
        let result = baseWord.valueOf();

        operations.forEach((o) => {
            switch (o.operation) {
                case OperationEnum.Delete: {
                    const regex = new RegExp(`${o.value}$`);
                    result = result.replace(regex, '');
                    break;
                }
                case OperationEnum.Add:
                    result = result + o.value;
                    break;
                case OperationEnum.Replace:
                    result = o.value;
                    break;
                default:
                    break;
            }
        });

        return result;
    }

    initByParce(str: string) {
        const parced = this.parce(str);

        this.number = parced.numb;
        const baseWord = parced.baseWord;
        this.nominativeCase = baseWord;

        const ncpParams = this.parceParams(parced.params[0]);
        const gcpParams = this.parceParams(parced.params[1]);

        this.nominativeCasePlural = this.runOperation(baseWord, ncpParams);
        this.genitiveCasePlural = this.runOperation(baseWord, gcpParams);
    }

    private _initTitlesArray() {
        this._titles = [this.nominativeCase, this.nominativeCasePlural, this.genitiveCasePlural];
    }

    declinate() {
        this._initTitlesArray();

        const val = this.number % 100 > 4 && this.number % 100 < 20 ? 2 : this._сases[Math.min(this.number % 10, 5)];

        return this._titles[val];
    }

    toString() {
        const declinated = this.declinate();

        return `${this.number} ${declinated}`;
    }
}
