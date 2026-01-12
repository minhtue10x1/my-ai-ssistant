
function processUserData(user) {
    let age = user.age;
    
    // Bug 1: Use of undeclared variable
    if (agg > 18) { 
        console.log("Adult");
    }

    // Bug 2: Infinite Loop potential
    while (true) {
        console.log("Processing...");
        // Missing break condition
    }

    // Bug 3: Security - Logging sensitive info
    console.log("Password: " + user.password); 

    return true;
}

export default processUserData;
