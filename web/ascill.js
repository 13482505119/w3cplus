/**
 * Created by Administrator on 2018/3/25.
 */
var str = '';
for (var i = 32; i < 127; i++) {
    str+= String.fromCharCode(i);
}

function getPasswordStrength(pwd) {
    var strength = 0;
    if (/\d+/.test(pwd)) {
        strength += 2
    }
    if (/[a-z]+/.test(pwd)) {
        strength += 4
    }
    if (/[A-Z]+/.test(pwd)) {
        strength += 4
    }
    if (/[ !"#$%&'()*+,\-\.\/:;<=>?@\[\\\]^_`{|}~]+/.test(pwd)) {
        strength += 4
    }
    strength += pwd.split("").sort().join("").replace(/(.).*\1/g,"$1").length / 2;
    return strength;
}
function getPasswordStrong(pwd) {
    var strong = 0;
    [].forEach.call(pwd.split("").sort().join("").replace(/(.).*\1/g,"$1").split(""), function(n) {
        if (/\d+/.test(n)) {
            strong += 2
        } else if (/[a-z]+/.test(n)) {
            strong += 4
        } else if (/[A-Z]+/.test(n)) {
            strong += 4
        } else {
            strong += 5
        }
    });

    return strong
}
/**
 * 密码强度判断
 * @param pwd
 * @returns {number} <20弱， 21-30中， >31强
 */
function getStrength(pwd) {
    var strength = 0;
    if (/\d+/.test(pwd)) {
        strength += 2
    }
    if (/[a-z]+/.test(pwd)) {
        strength += 3
    }
    if (/[A-Z]+/.test(pwd)) {
        strength += 4
    }
    if (/[ !"#$%&'()*+,\-\.\/:;<=>?@\[\\\]^_`{|}~]+/.test(pwd)) {
        strength += 5
    }
    strength *= pwd.split("").sort().join("").replace(/(.).*\1/g,"$1").length;
    return strength;
}


function log(arr) {
    [].forEach.call(arr, function(n) {
        console.log(n, " : ", getPasswordStrength(n), ' / ', getStrength(n));
    });
}

console.log('纯数字');
log(['111111','123321','123456','123456789','1234567890']);
console.log('---------- < 7');

console.log('纯小写子母');
log(['aaaaaa','aaabbb','abcabc','abcabcabcabc','abcdab','abcdea','abcdef','abcdefg']);
console.log('---------- < 7 >');

console.log('纯大写子母');
log(['AAAAAA','AAABBB','ABCABC','ABCABCABCABC','ABCDAB','ABCDEA','ABCDEF','ABCDEFG']);
console.log('---------- < 7 >');

console.log('小写子母数字组合');
log(['aaa111','aaa112','aaa123','abc111','abc123']);
console.log('---------- < 7');

console.log('大写子母数字组合');
log(['AAA111','AAA112','AAA123','ABC111','ABC123']);
console.log('---------- < 7');

console.log('字符数字组合');
log(['!11111','!12345','!121212','!aaaaa','!ababa']);
console.log('---------- > 7');

console.log('混合');
log(['pwd123','AAAaaa','ABABaa','Pwd123','Aa1234','!Pwd123']);
console.log('---------- > 7');


//console.log('纯数字');
//log(['','','','','','']);
//console.log('---------- < 7');

