//const {v4: uuidv4} = require("uuid");
const User = require("../models/user");
const {setUser} = require("../service/auth");

async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;

    await User.create({
      name,
      email,
      password,
    });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
}

async function handleUserlogin(req, res) {
  try {
    console.log("Login body:", req.body);

    const { email, password } = req.body;

    // Check whether any user exists with this email
    const user = await User.findOne({ email, password });

    console.log("User found by email:", user);

    if (!user) {
      return res.render("login", {
        error: "Email not registered",
      });
    }

    // For now, compare the password directly
    if (user.password !== password) {
      return res.render("login", {
        error: "Invalid password",
      });
    }

    //const sessionId = uuidv4();

    //console.log("Creating session:", sessionId);

    const token = setUser(user);

    res.cookie("uid", token);

    console.log("Login successful");

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
}

module.exports = {
  handleUserSignUp,
  handleUserlogin,
};