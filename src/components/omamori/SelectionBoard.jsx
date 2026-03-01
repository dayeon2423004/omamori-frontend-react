import { frameList } from '../../api/omamoriExpansion.api';
import { stamps } from '../../api/omamoriExpansion.api';
import { useState, useEffect } from 'react';

export default function SelectionBoard({ type, onSelect }) {
  const [items, setItems] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        let response;
        
        // API 전달
        if (type === "Stamp") {
            response = await stamps(); 
            const normalized = response.data.data.map(item => {
                const fullUrlFromServer = item.url;
                const pathOnly = new URL(fullUrlFromServer).pathname; // http://localhost 삭제
                return {
                    id : item.asset_key,
                    name : item.file_name,
                    preview_url : pathOnly,
                    key : item.asset_key
                };
            });
            setItems(normalized);

        } else if (type === "Frame") {
            response = await frameList(); 
            setItems(response.data);
        } 

      } catch (error) {
        console.log(error);
      }
    })();
  }, [type]);

  return (
    <div style={{ maxHeight: '150px', overflowY: 'scroll', border: '1px solid #ccc' }}>
      {items.map(item => (
        <div 
          key={item.id} 
          onClick={() => onSelect({ ...item, type })}
          style={{ cursor: "pointer", padding: '4px' }}
        >
          {item.preview_url ? <img src={`${baseUrl}${item.preview_url}`} alt={item.name} style={{ width: 80, height: 80 }} crossOrigin="anonymous" /> : "X"}
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}