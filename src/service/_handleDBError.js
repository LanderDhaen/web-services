const ServiceError = require("../core/serviceError");

const handleDBError = (error) => {
  const { code = "", sqlMessage } = error;

  if (code === "ER_DUP_ENTRY") {
    switch (true) {
      // Lessenreeks

      case sqlMessage.includes("idx_lessenreeks_id_unique"):
        return ServiceError.validationFailed(
          "Lessenreeks met dit id bestaat al"
        );

      // Les

      case sqlMessage.includes("idx_les_id_unique"):
        return ServiceError.validationFailed("Les met dit id bestaat al");

      // Groep

      case sqlMessage.includes("idx_groep_id_unique"):
        return ServiceError.validationFailed("Groep met dit id bestaat al");
      case sqlMessage.includes("idx_groep_naam_unique"):
        return ServiceError.validationFailed("Groep met deze naam bestaat al");

      // Lesgever

      case sqlMessage.includes("idx_lesgever_id_unique"):
        return ServiceError.validationFailed("Lesgever met dit id bestaat al");
      case sqlMessage.includes("idx_user_email_unique"):
        return ServiceError.validationFailed(
          "Er bestaat al een lesgever met dit emailadres"
        );
      case sqlMessage.includes("idx_user_GSM_unique"):
        return ServiceError.validationFailed(
          "Er bestaat al een lesgever met dit GSM-nummer"
        );

      // Lesvoorbereiding

      case sqlMessage.includes("idx_lesvoorbereiding_id_unique"):
        return ServiceError.validationFailed(
          "Lesvoorbereiding met dit id bestaat al"
        );
      case sqlMessage.includes("idx_link_to_PDF_unique"):
        return ServiceError.validationFailed(
          "Er bestaat al een lesvoorbereiding met deze link"
        );

      // Lesgeverschema

      case sqlMessage.includes("idx_lesgeverschema_id_unique"):
        return ServiceError.validationFailed(
          "Lesgeverschema met dit id bestaat al"
        );

      default:
        console.log(sqlMessage);
        return ServiceError.validationFailed("This item already exists");
    }
  }

  if (code.startsWith("ER_NO_REFERENCED_ROW")) {
    switch (true) {
      // Lessenreeks

      // Les

      case sqlMessage.includes("fk_les_lessenreeks"):
        return ServiceError.notFound("Deze lessenreeks bestaat niet");

      // Groep

      // Lesgever

      case sqlMessage.includes("fk_lesgever_groep"):
        return ServiceError.notFound("Deze groep bestaat niet");

      // Lesvoorbereiding

      case sqlMessage.includes("fk_lesvoorbereiding_les"):
        return ServiceError.notFound("Deze les bestaat niet");

      case sqlMessage.includes("fk_lesvoorbereiding_groep"):
        return ServiceError.notFound("Deze groep bestaat niet");

      // Lesgeverschema

      case sqlMessage.includes("fk_lesgeverschema_lesgever"):
        return ServiceError.notFound("Deze lesgever bestaat niet");

      case sqlMessage.includes("fk_lesgeverschema_les"):
        return ServiceError.notFound("Deze les bestaat niet");
    }
  }

  return error;
};

module.exports = handleDBError;
