const students=[
    {name:"Jane", marks:90, course:"Eng"},
    {name:"John", marks:60, course:"CompSci"},
    {name:"Peter", marks:50, course:"Eng"}
];
console.log(students[0].name, " : " + students[0].marks, " : " + students[0].course);
console.log(students[1].name, " : " + students[1].marks, " : " + students[1].course);
console.log(students[2].name, " : " + students[2].marks, " : " + students[2].course);

function findCourse(){
for(i=0;i<students.length; i++){
    if(students[i].course === 'Eng'){
        console.log(students[i].name);
    }
    else{
        return  "No student doing Engineering";
    }
}
}

console.log(findCourse());

/*
function calculateMarks(){
    return students[0].marks+ students[1].marks+ students[2].marks;
}

console.log(calculateMarks());

function findJane(){
    for(let i=0;i<students.length; i++){
        if(students[i].name === "Jane"){
        return "Grade = A";
    }
    else{
        return "The student is not found";
    }
        
}
}

console.log(findJane());

function above70(){
    for(let i=0; i<students.length; i++){  
        if(students[i].marks>70 ){
            return students[i].name + " has : " + students[i].marks;
}
        else{
            return "No student with marks above 70 found";
}
}
}
console.log(above70());

function coursesDone(){
        return `${students[0].course}, ${students[1].course}, ${students[2].course}`;
}

console.log(coursesDone());

const classes={
    class1 :{name:"Group A", points: 70},
    class2: {name: "Group B", points: 80},
    class3: {name: "Group C", points: 30}
};
classes.class2.points= 90;

console.log(classes.class1.name, ": " + classes.class1.points);
console.log(classes.class2.name, ": " + classes.class2.points);
console.log(classes.class3.name, ": " + classes.class2.points);
*/



