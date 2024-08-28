interface IProps {
  hasHangingLight?: boolean;
}

export default function Divider({ hasHangingLight }: IProps) {
  return (
    <div className="divider-component">
      <div className="floor-wall"></div>

      {hasHangingLight && (
        <>
          <div className="base-wall"></div>

          <div className="hanging-light">
            <div className="hangers">
              <div className="hanger"></div>

              <div className="hanger"></div>
            </div>

            <div className="hanging-light-top-part"></div>
            <div className="hanging-light-bottom-part"></div>

            <div className="light"></div>
          </div>
        </>
      )}
    </div>
  );
}
