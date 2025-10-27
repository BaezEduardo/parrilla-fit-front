// src/components/DishTable.jsx
export default function DishTable({ dishes, onEdit, onDelete }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Disponible</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((d) => (
          <tr key={d.id}>
            <td>{d.Name}</td>
            <td>{d.Category}</td>
            <td>${Number(d.Price).toFixed(0)}</td>
            <td>{d.Available ? "✅" : "❌"}</td>
            <td>
              <button className="btn btn--small" onClick={() => onEdit(d)}>Editar</button>
              <button className="btn btn--small btn--danger" onClick={() => onDelete(d.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
