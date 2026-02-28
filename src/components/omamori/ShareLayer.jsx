export default function ShareLayer({ layer, baseUrl }) {
    return (
        <div
            style={{
                position: "absolute",
                left: layer.transform.x ?? 0,
                top: layer.transform.y ?? 0,
                zIndex: layer.zIndex ?? 1
            }}
        >
        {layer.type === "text" && (
            <p
                style={{
                    fontSize: `${layer.props.fontSize}px`,
                    color: layer.props.color
                }}
            >
                {layer.props.content}
            </p>
        )}

        {layer.type === "stamp" && (
            <img
                width={50}
                src={`${baseUrl}${layer.props.url}`}
                alt=""
            />
        )}
        </div>
    );
}