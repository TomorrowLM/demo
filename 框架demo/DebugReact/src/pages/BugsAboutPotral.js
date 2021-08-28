import {React, useState, ReactDOM} from "../whichReact";

function PortalRenderer() {
  const [show, setShow] = useState(false);
  const node = <div>who is handsome？</div>;
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          console.log("PortalRenderer click"); //sy-log
          setShow(!show);
        }}>
        Render portal
      </button>

      {show && ReactDOM.createPortal(node, document.body)}
    </React.Fragment>
  );
}

function ToastButton() {
  const [show, setShow] = useState(false);

  console.log("ToastButton render", show); //sy-log

  React.useEffect(() => {
    console.log("useEffect", show);

    if (!show) return;

    console.log("----------------------------------", show);

    function clickHandler(e) {
      console.log("原生事件", show); //sy-log
      setShow(false);
    }

    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [show]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          console.log("合成事件"); //sy-log
          setShow(true);
        }}>
        Show Toast
      </button>
      {show && <div>Hey, Ka Song!</div>}
    </div>
  );
}

function BugsAboutPotral() {
  return (
    <div>
      <PortalRenderer />
      <ToastButton />
    </div>
  );
}

export default BugsAboutPotral;
