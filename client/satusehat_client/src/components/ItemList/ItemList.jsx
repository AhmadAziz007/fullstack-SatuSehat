import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteItems } from "../../service/ItemsService";
import toast from "react-hot-toast";
import ItemForm from "../ItemForm/ItemForm";
import ItemsUpdate from "../ItemUpdate/ItemUpdate";

const ItemList = () => {
  const { itemsData, setItemsData } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalUpdate, setModalUpdate] = useState(false);

  const openModalAdd = () => {
    setIsModalAdd(true);
  }

  const closeModalAdd = () => {
    setIsModalAdd(false);
  }

  const openModalUpdate = (items) => {
    setSelectedItem(items);
    setModalUpdate(true);
  }

  const closeModalUpdate = () => {
    setModalUpdate(false);
  }

  const filterItems = itemsData.filter(items => items.name && items.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const deleteByItemsId = async (itemId) => {
    try {
      const response = await deleteItems(itemId);
      if (response.status >= 200 && response.status < 300) {
        setItemsData(prevItems =>
          prevItems.filter(item => item.itemId !== itemId)
        );
        toast.success("Item deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting item");
    }
  }

  return (
    <div className="items-list-container p-3">
      <h2>List Items</h2>
      <button type="button" className="btn btn-primary" onClick={openModalAdd}>
        Add Items
      </button>

      {/* Modal Add*/}
      {isModalAdd && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Items</h5>
                <button type="button" className="btn-close" onClick={closeModalAdd}></button>
              </div>
              <div className="modal-body">
                <ItemForm closeModal={closeModalAdd} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="input-group mb-3">
        <input type="text"
          name='keyword'
          id='keyword'
          placeholder='Search by keyword'
          className='form-control'
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <span className='input-group-text bg-warning'>
          <i className='bi bi-search'></i>
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterItems.map((item) => (
            <tr key={item.itemId}>
              <td><img src={item.imgUrl} alt={item.name} width="600" height="600" /></td>
              <td>{item.categoryName}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => openModalUpdate(item)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => deleteByItemsId(item.itemId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal Update*/}
      {isModalUpdate && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Items</h5>
                <button type="button" className="btn-close" onClick={closeModalUpdate}></button>
              </div>
              <div className="modal-body">
                <ItemsUpdate
                  closeModal={closeModalUpdate}
                  items={selectedItem}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemList;