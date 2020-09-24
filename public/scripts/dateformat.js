/* eslint-disable import/prefer-default-export */
/* eslint-disable func-names */
/* eslint-disable no-cond-assign */
/* eslint-disable no-return-assign */
/* eslint-disable no-extend-native */

export function addDateFormat() {
  Date.prototype.format = function (f) {
    if (!this.valueOf()) return ' ';

    const weekKorName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const weekKorShortName = ['일', '월', '화', '수', '목', '금', '토'];

    const weekEngName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const weekEngShortName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const d = this;

    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, ($1) => {
      switch ($1) {
        case 'yyyy':
          return d.getFullYear(); // 년 (4자리)

        case 'yy':
          return (d.getFullYear() % 1000).zf(2); // 년 (2자리)

        case 'MM':
          return (d.getMonth() + 1).zf(2); // 월 (2자리)

        case 'dd':
          return d.getDate().zf(2); // 일 (2자리)

        case 'KS':
          return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)

        case 'KL':
          return weekKorName[d.getDay()]; // 요일 (긴 한글)

        case 'ES':
          return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)

        case 'EL':
          return weekEngName[d.getDay()]; // 요일 (긴 영어)

        case 'HH':
          return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)

        case 'hh':
          return (d.getHours() % 12 ? d.getHours() % 12 : 12).zf(2); // 시간 (12시간 기준, 2자리)

        case 'mm':
          return d.getMinutes().zf(2); // 분 (2자리)

        case 'ss':
          return d.getSeconds().zf(2); // 초 (2자리)

        case 'a/p':
          return d.getHours() < 12 ? '오전' : '오후'; // 오전/오후 구분

        default:
          return $1;
      }
    });
  };

  String.prototype.string = function (len) {
    let s = '';
    let i = 0;
    while (i++ < len) {
      s += this;
    }
    return s;
  };

  String.prototype.zf = function (len) {
    return '0'.string(len - this.length) + this;
  };

  Number.prototype.zf = function (len) {
    return this.toString().zf(len);
  };
}
/*
var _today = new Date(); // 예제 기준 시간 : 2000-01-01 13:12:12
console.log(_today.format('yyyy-MM-dd'));
console.log(_today.format('HH:mm:ss'));
console.log(_today.format('yyyy-MM-dd(KS) HH:mm:ss'));
console.log(_today.format('yyyy-MM-dd a/p hh:mm:ss'));
*/
