validators will not run by default for patch and put for allowing validators to run we need to put one method present in mongoose schema that is we need to pass an option as an argument "runValidators:true"

indexing in the database make finding or searching any entry in db very fast {index: true}

Model.pre -- is a middelware used for prechek any validation before saving any think to database althoww we can do it on api level too

enum - { it is a schema level validation that allowed any field to do allow only entry that is inclueds or define in enum}

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
problem 1 - in profile API jwt must be provided error not handeled properly
problem 2 - passwordAuth middelware not able to use it

find vs findone -- find returns an object while find returns an array
indexing in the database make finding or searching any entry in db very fast {index: true}
ref And Populate -- we need to mention refrance of another collection to schema to populate it is similer to joins in SQL

feed api logic // $ne $nin $and QueryOperators
Pagination
