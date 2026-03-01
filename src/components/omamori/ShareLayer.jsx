export default function ShareLayer({ layer, baseUrl }) {
    const scale = 0.55; // 캔버스 크기 대비 비율

    return (
        <div
            style={{
                position: "absolute",
                left: (layer.transform.x ?? 0) * scale,
                top: (layer.transform.y ?? 0) * scale,
                zIndex: layer.zIndex ?? 1,
                pointerEvents: "none"
            }}
        >
        {layer.type === "text" && (
            <p style={{
                fontSize: `${layer.props.fontSize}px`,
                color: layer.props.color,
                margin: 0,
                whiteSpace: "nowrap"
            }}>
                {layer.props.content}
            </p>
        )}

        {layer.type === "stamp" && (
            <img
                width={50 * scale}
                src={`${baseUrl}${layer.props.url}`}
                alt="stamp"
            />
        )}
        </div>
    );
}