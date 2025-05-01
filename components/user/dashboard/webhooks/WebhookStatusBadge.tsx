import React from "react";

interface WebhookStatusBadgeProps {
  status: "active" | "inactive" | "failed";
}

export const WebhookStatusBadge: React.FC<WebhookStatusBadgeProps> = ({
  status,
}) => {
  let bgColor = "";
  let textColor = "";
  let label = "";

  switch (status) {
    case "active":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "활성";
      break;
    case "inactive":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = "비활성";
      break;
    case "failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      label = "실패";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};
