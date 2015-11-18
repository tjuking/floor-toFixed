var assert = chai.assert;

describe("floorToFixed", function () {

    describe("#amount", function () {
        it("没传入数据的时候，应该当做0来处理", function () {
            assert.equal(floorToFixed(), "0.00");
        });
        it("正整数处理", function () {
            assert.equal(floorToFixed(199), "199.00");
        });
        it("正整数字符串处理", function () {
            assert.equal(floorToFixed("1"), "1.00");
        });
        it("带前后空格字符串处理", function () {
            assert.equal(floorToFixed("  122 4211 9664  "), "12,242,119,664.00");
        });
        it("4位正整数字符串处理", function () {
            assert.equal(floorToFixed("2999"), "2,999.00");
        });
        it("5位正整数字符串处理", function () {
            assert.equal(floorToFixed("42999"), "42,999.00");
        });
        it("6位正整数字符串处理", function () {
            assert.equal(floorToFixed("642999"), "642,999.00");
        });
        it("7位正整数字符串处理", function () {
            assert.equal(floorToFixed("5642999"), "5,642,999.00");
        });
        it("带1位小数字符串处理", function () {
            assert.equal(floorToFixed("32.1"), "32.10");
        });
        it("带2位小数字符串处理", function () {
            assert.equal(floorToFixed("352.22"), "352.22");
        });
        it("带3位小数字符串处理", function () {
            assert.equal(floorToFixed("3652.229"), "3,652.22");
        });
        it("带4位小数字符串处理", function () {
            assert.equal(floorToFixed("8452638.5122"), "8,452,638.51");
        });
        it("负整数字符串处理", function () {
            assert.equal(floorToFixed("-290"), "-290.00");
        });
        it("4位负整数字符串处理", function () {
            assert.equal(floorToFixed("-1263"), "-1,263.00");
        });
        it("负数带1位小数字符串处理", function () {
            assert.equal(floorToFixed("-78208.1"), "-78,208.10");
        });
        it("负数带2位小数字符串处理", function () {
            assert.equal(floorToFixed(new Number(-823629.76)), "-823,629.76");
        });
        it("负数带3位小数字符串处理", function () {
            assert.equal(floorToFixed("-77736626.480"), "-77,736,626.48");
        });
        it("负数字符串小数位进位处理", function () {
            assert.equal(floorToFixed(-12.283), "-12.29");
        });
        it("负数字符串整数位进位处理", function () {
            assert.equal(floorToFixed("-12.99023"), "-13.00");
        });
        it("负数字符串整数位进位处理（多出一位）", function () {
            assert.equal(floorToFixed("-999.99000001"), "-1,000.00");
        });
    });

    describe("#decimal", function () {
        it("没传入小数位时，默认按照2位处理", function () {
            assert.equal(floorToFixed(1222), "1,222.00");
        });
        it("保留2位小数", function () {
            assert.equal(floorToFixed("28364.1", 2), "28,364.10");
        });
        it("不保留小数", function () {
            assert.equal(floorToFixed("12817.9283773", 0), "12,817");
        });
        it("保留1位小数", function () {
            assert.equal(floorToFixed("-12.99999", "1"), "-13.0");
        });
        it("保留3位小数", function () {
            assert.equal(floorToFixed("627393883.2639", new Number(3)), "627,393,883.263");
        });
        it("保留10位小数", function () {
            assert.equal(floorToFixed("23.0123456789", 10), "23.0123456789");
        });
        it("非有效的小数位将会被调整为默认的2位", function () {
            assert.equal(floorToFixed(-74823, -3), "-74,823.00");
        });
    });

    describe("#separator", function(){
        it("没传入分隔符时，默认为','", function () {
            assert.equal(floorToFixed("83732", 1), "83,732.0");
        });
        it("传入分隔符'-'", function () {
            assert.equal(floorToFixed(new String(-52839.56), 4, "-"), "-52-839.5600");
        });
        it("传入空字符串''", function () {
            assert.equal(floorToFixed(37282.789, 2, ""), "37282.78");
        });
        it("传入逗号','", function () {
            assert.equal(floorToFixed("-4273783928.99999", 3, ","), "-4,273,783,929.000");
        });
        it("手机号码去空格", function () {
            assert.equal(floorToFixed("  122 4211 9664  ", 0, ""), "12242119664");
        });
    });

});