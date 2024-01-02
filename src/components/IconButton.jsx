import { Button } from "react-bootstrap";

export default function IconButton({ isTop, className, onClick, text }) {
  const margin = `light rounded-pill`;

  const iconMargin = text ? " me-3" : " ";

  return (
    <Button variant={margin} onClick={onClick}>
      <i
        className={className + iconMargin}
        style={{ fontSize: 24, color: isTop ? "dodgerblue" : "black" }}
      ></i>
      {text}
    </Button>
  );
}
