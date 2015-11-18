/**
 * floor-tofixed.js v0.1
 * 向下保留数值，保留指定位数的小数，可以设置整数部分每三位的分隔符
 * @author tjuking https://github.com/tjuking/floor-toFixed
 * @param amount {string|number} 传入的数值
 * @param [decimal=2] {number} 保留小数位
 * @param [separator=","] {string} 分隔符
 * @returns {string} 处理后的字符串数据
 */

function floorToFixed(amount, decimal, separator) {


    /************ 变量声明 ************/

    var isNegative; //判断amount是否为负数的标识位
    var integerPart; //amount的整数部分
    var decimalPart; //amount的小数部分
    var integerArr; //整数部分的单字符数组
    var decimalArr; //小数部分的单字符数组
    var integerArrLength; //整数单字符数组长度
    var decimalArrLength; //小数单字符数组长度
    var withSepIntegerArr; //带分隔符的整数单字符数组
    var firstDotIndex; //amount中第一个小数点出现的位置
    var defaultDecimal = 2; //默认保留两位小数
    var defaultSeparator = ","; //默认分隔符为逗号
    var negativeCarry = false; //负数时是否需要进位的标识
    var negativeIntegerCarry = false; //负数时是否需要向整数进位的标识
    var i; //循环时使用


    /************ 数值amount处理 ************/

    //对于undefined null 0 false将统一处理为"0"
    if (!amount) {
        amount = "0";
    }
    //amount需要转化成字符串才能进行后序操作（这里不使用amount+""的方式）
    if (typeof amount !== "string") {
        amount = new String(amount).toString();
    }
    //通过前置符号来判断是否是负数
    isNegative = amount.indexOf("-") === 0;
    //将所有非数字和非小数点的占位移除
    amount = amount.replace(/[^\d\.]/g, "");
    //获取首个小数点出现的位置
    firstDotIndex = amount.indexOf(".");
    //如果有小数点则需要分成两部分来设置整数部分和小数部分
    if (firstDotIndex >= 0) {
        integerPart = amount.substring(0, firstDotIndex) || "0";
        decimalPart = amount.substr(firstDotIndex + 1, amount.length).replace(/\./g, "") || "0";
    } else { //没有小数点时的设置
        integerPart = amount;
        decimalPart = "0";
    }
    //将整数部分和小数部分转化成单字符
    integerArr = integerPart.split("");
    decimalArr = decimalPart.split("");
    integerArrLength = integerArr.length;
    decimalArrLength = decimalArr.length;


    /************ 小数位decimal处理 ************/

    //对于未传入小数位数或者传入的是undefined，设置默认小数位
    if (typeof decimal === "undefined") {
        decimal = defaultDecimal;
    }
    //将小数位转换成数字
    decimal = +decimal;
    //对于非数字和负数，设置为默认小数位
    if (isNaN(decimal) || decimal < 0) {
        decimal = defaultDecimal;
    }
    //转化为整数，避免小数问题
    decimal = parseInt(decimal, 10);


    /************ 分隔符separator处理 ************/

    //对于未传入分隔符或者传入的是undefined，设置为默认分隔符
    if (typeof separator === "undefined") {
        separator = defaultSeparator;
    } else if (typeof separator !== "string") { //对于非字符串的分隔符需要转换成字符串
        separator = new String(separator).toString();
    }


    /************ 核心逻辑处理 ************/

    //小数位不足，需要补全
    if (decimal > decimalArrLength) {
        for (i = 0; i < decimal - decimalArrLength; i++) {
            decimalArr.push("0");
        }
    } else if (decimal < decimalArrLength) { //小数位过多，需要去除
        //如果是负数，需要向上保留数值
        if (isNegative) {
            //遍历所需小数位之后的小数值是否大于0
            for (i = decimal; i < decimalArrLength; i++) {
                //如果大于0则需要小数位进位
                if (decimalArr[i] > 0) {
                    negativeCarry = true;
                    break;
                }
            }
            //如果需要小数位进位
            if (negativeCarry) {
                //如果没有需要保留的小数位，则标记需要向整数位进位，并且设置小数位数组为空
                if (decimal === 0) {
                    negativeIntegerCarry = true;
                    decimalArr = [];
                } else {
                    //小数位进位处理
                    for (i = decimal - 1; i >= 0; i--) {
                        //如果当前值是9，则置为0
                        if (decimalArr[i] === "9") {
                            decimalArr[i] = "0";
                            //如果是第一个小数，则需要向整数位进位
                            if (i === 0) {
                                negativeIntegerCarry = true;
                            }
                        } else { //不是9，则加1后退出循环
                            decimalArr[i] = (+decimalArr[i] + 1) + "";
                            break;
                        }
                    }
                }
                //如果需要向整数位进位
                if (negativeIntegerCarry) {
                    //如果当前值是9，则置为0
                    for (i = integerArrLength - 1; i >= 0; i--) {
                        if (integerArr[i] === "9") {
                            integerArr[i] = "0";
                            //如果是第一个整数，则需要在最前面插入1
                            if (i === 0) {
                                integerArr.unshift("1");
                                integerArrLength = integerArr.length;
                                break;
                            }
                        } else { //不是9，则加1后退出循环
                            integerArr[i] = (+integerArr[i] + 1) + "";
                            break;
                        }
                    }
                }
            }
        }
        //截取到指定位数的小数
        decimalArr = decimalArr.slice(0, decimal);
    }


    /************ 返回结果修正处理 ************/

    //如果有设置分隔符，需要插入分隔符
    if (separator) {
        //初始化空数组
        withSepIntegerArr = [];
        for (i = 0; i < integerArrLength; i++) {
            //每三位添加分隔符，第一位和最后一位不添加
            if (i % 3 === integerArrLength % 3 && i !== integerArrLength - 1 && i !== 0) {
                withSepIntegerArr.push(separator);
            }
            //插入对应元素
            withSepIntegerArr.push(integerArr[i]);
        }
        //赋值回整数单字符数组
        integerArr = withSepIntegerArr;
    }
    //根据修正后的数组元素调整整数部分和小数部分的值
    integerPart = integerArr.join("");
    decimalPart = decimalArr.join("");
    //如果不需要保留小数则直接设置结果为整数部分的值
    if (decimal === 0) {
        amount = integerPart;
    } else { //需要保留小数时的结果值是两部分结合而成的值
        amount = integerPart + "." + decimalPart;
    }
    //如果是负数，需要补充上负号
    if (isNegative) {
        amount = "-" + amount;
    }

    //返回结果值
    return amount;
}