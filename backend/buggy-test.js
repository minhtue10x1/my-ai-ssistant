function calculateSum(a, b) {
    return a + b;
}

function potentiallyBuggyCode() {
    let x = 10;
    let y = 0;
    
    // Bug 1: Division by zero not handled
    let result = x / y;
    
    console.log("Result is: " + result);

    // Bug 2: Unused variable
    let unused = "I am never used";

    // Bug 3: Typo in variable name (if this were executed)
    // console.log(unsued); 

    if (x = 5) { // Bug 4: Assignment in conditional
        console.log("X is 5");
    }

    return result;
}

export { calculateSum, potentiallyBuggyCode };
