import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { omamoriPublic } from "../api/omamoriExport.api";
import ShareOmamori from "../components/omamori/ShareOmamori";

export default function SharePage() {
    const { token } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
        try {
            const res = await omamoriPublic(token);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
        })();
    }, [token]);

    if (!data) return <p>로딩중...</p>;

    return <ShareOmamori omamori={data} />;
}