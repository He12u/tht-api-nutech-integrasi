const errorHandler = async (error, req, res, next) => {
  console.log(error.name, "<<<<< ERROR DI ERROR HANDLERS");
  console.log(error);
  if (
    error.name === "email required!" ||
    error.name === "first_name required!" ||
    error.name === "last_name required!" ||
    error.name === "password required!"
  ) {
    res.status(400).json({
      status: 102,
      message: `Parameter ${error.name.split(" ")[0]} harus di isi`,
      data: null,
    });
  } else if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    res.status(400).json({
      status: 102,
      message: error.errors[0].message,
      data: null,
    });
  } else if (error.name === "Unauthorized") {
    res.status(401).json({
      status: 103,
      message: "email atau password salah",
      data: null,
    });
  } else if (error.name === "Invalid email format!") {
    res.status(400).json({
      status: 102,
      message: "Parameter email tidak sesuai format",
      data: null,
    });
  } else if (
    error.name === "JsonWebTokenError" ||
    error.name === "Token Unauthorized"
  ) {
    res.status(401).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  } else if (error.name === "Invalid file format!") {
    res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai",
      data: null,
    });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
