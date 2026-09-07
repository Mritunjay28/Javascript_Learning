// Function Scope (var)
function testVar() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 10 (var leaks outside if-block!)
}
testVar();

// Block Scope (let & const)
function testLet() {
    if (true) {
        let y = 20;
        const z = 30;
    }
    console.log(y); // ReferenceError: y is not defined
    // console.log(z); // ReferenceError: z is not defined
}
testLet();