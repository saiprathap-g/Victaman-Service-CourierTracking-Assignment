import React from "react";

import "./index.css";

const DeletePackageButton = ({ packageId, onDelete }) => {
  return (
    <button
      className="delete-package-button"
      onClick={() => onDelete(packageId)}
    >
      Delete Package
    </button>
  );
};

export default DeletePackageButton;
