validators will not run by default for patch and put for allowing validators to run we need to put one method present in mongoose schema that is we need to pass an option as an argument "runValidators:true"

API level senetization --if require we need to create checks in api it self to maintain database
const ALLOWED_UPDATES = [
"lastName",
"Password",
"photoUrl",
"about",
"skills",
];
const isUpdateAllowed = Object.keys(data).every((k) =>
ALLOWED_UPDATES.includes(k)
);
if (isUpdateAllowed) return res.status(400).send("Can Not Update fields");
if (data?.skills.lenght > 10)
return res.status(400).send("Skills Not more than 10");

NEED TO BE FIXED SOON
problem 1 - in profile API jwt must be provided can not handeled it properly
problem 2 - in passwordAuth middelware not able to use it
