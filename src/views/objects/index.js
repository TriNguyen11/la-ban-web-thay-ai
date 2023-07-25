import Door_Window from "@floorplan/views/objects/door/Window";
import Door_Door from "@floorplan/views/objects/door/Door";
import OpeningWindow from "@floorplan/views/objects/door/OpeningWindow";
import DoubleDoor from "@floorplan/views/objects/door/DoubleDoor";
import Garage from "@floorplan/views/objects/door/Garage";
import Roller from "@floorplan/views/objects/door/Roller";
import SlidingDoor1 from "@floorplan/views/objects/door/SlidingDoor1";
import SlidingDoor from "@floorplan/views/objects/door/SlidingDoor";
import Folding from "@floorplan/views/objects/door/Folding";
import DoubleFolding from "@floorplan/views/objects/door/DoubleFolding";
import Pocket from "@floorplan/views/objects/door/Pocket";
import DoublePocket from "@floorplan/views/objects/door/DoublePocket";

const renderDoor = (props) => {
  switch (props.code) {
    case "window":
      return <Door_Window {...props} />;
    case "opening-window":
      return <OpeningWindow {...props} />;
    case "double-door":
      return <DoubleDoor {...props} />;
    case "garage":
      return <Garage {...props} />;
    case "roller-door":
      return <Roller {...props} />;
    case "sliding-door":
      return <SlidingDoor {...props} />;
    case "sliding-door-1":
      return <SlidingDoor1 {...props} />;
    case "folding-door":
      return <Folding {...props} />;
    case "double-folding-door":
      return <DoubleFolding {...props} />;
    case "pocket-door":
      return <Pocket {...props} />;
    case "double-pocket-door":
      return <DoublePocket {...props} />;
    default:
      return <Door_Door {...props} />;
  }
};

export default {
  renderDoor,
};
