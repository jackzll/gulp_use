var c = 'aaaa';
document.querySelector('#root').innerHTML = window.devicePixelRatio;


//数组去重
// function unique(array) {
// 	if (!typeof Array.isArray(array)) return;
// 	var arr = [];
// 	array.map(function(ele) {
// 		if (arr.indexOf(ele) === -1) {
// 			arr.push(ele);
// 		}
// 	})
// 	return arr;
// }
function unique(array) {
	var newArr = [];
	var i = 0;
	while (i < array.length) {
		var repeat = false;
		for (var index = i + 1; index < array.length; index++) {
			if (array[i] === array[index]) {
				repeat = true;
			}
		}
		if (!repeat) {
			newArr.push(array[i]);
		}
		i = i + 1;
	}
	return newArr;
}


var arr = [1, 1, 1, 2, 2, 3, 1, 2, 3.4, 55, 55, 1, 9];
var sortD = unique(arr);
console.log(sortD);
//排序,冒泡
// function sort(array) {
// 	var c = array;
// 	c.map(function(ele) {
// 		c.forEach(function(el, i) {
// 			if (c[i] > c[i + 1]) {
// 				var max = c[i];
// 				c[i] = c[i + 1];
// 				c[i + 1] = max;
// 			}

// 		})
// 	})

// 	return c;
// }
// 冒泡优化
function sort(array) {
	var c = array;
	c.map(function(ele, index) {
		for (var i = 0; i < c.length - 1 - index; i++) {
			if (c[i] > c[i + 1]) {
				var max = c[i];
				c[i] = c[i + 1];
				c[i + 1] = max;
			}
		}
	})
	return c;
}
// 快排
// function quickSort(){

// }



// console.log('sort', sort(sortD));