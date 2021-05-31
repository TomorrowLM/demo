let familys = [{
	name: 'JavaScript',
	age: 26,
    commentnum:699
}, {
	name: 'HTML',
	age: 26,
    commentnum:996
}, {
	name: 'CSS',
	age: 25,
    commentnum:700
},{
	name: 'Vue',
	age: 7,
    commentnum:1024
},{
	name: 'React',
	age: 8,
    commentnum:1618
}];


    function compare(p1,p2){
        return function(object1,object2){
            let value1 = object1[p1]
            let value2 = object2[p1]
            console.log(value1)
            if(value2<value1){
                return -1;
            }else if(value2>value1){
                return 1;
            }else {
                let value3 = object1[p2]
                let value4 = object2[p2]
                console.log(value3)
                if(value3<value4){
                return 1;
                }else if(value3>value4){
                return 1; 
            }
            }
        }
    }
   
familys.sort(compare("age","commentnum"));
console.log(familys)
