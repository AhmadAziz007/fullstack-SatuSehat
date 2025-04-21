import './CategoryList.css';
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { deleteCategory } from '../../service/CategoryService';
import toast from 'react-hot-toast';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import CategoryUpdate from '../../components/CategoryUpdate/CategoryUpdate';

const CategoryList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories, setCategories } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalUpdate, setModalUpdate] = useState(false);

  const openModalAdd = () => {
    setIsModalAdd(true);
  }

  const closeModalAdd = () => {
    setIsModalAdd(false);
  }

  const openModalUpdate = (category) => {
    setSelectedCategory(category);
    setModalUpdate(true);
  }

  const closeModalUpdate = () => {
    setModalUpdate(false);
  }

  const filteredCategories = categories.filter(category =>
    category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteByCategoryId = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.status >= 200 && response.status < 300) {
        const updatedCategories = categories.filter(category => category.categoryId !== categoryId);
        setCategories(updatedCategories);
        toast.success("Category deleted");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete category");
    }
  }

  return (
    <div className="category-list-container p-3">
      <h2>List Categories</h2>
      <button type="button" className="btn btn-primary" onClick={openModalAdd}>
        Add Category
      </button>

      {/* Modal Add*/}
      {isModalAdd && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Category</h5>
                <button type="button" className="btn-close" onClick={closeModalAdd}></button>
              </div>
              <div className="modal-body">
                <CategoryForm closeModal={closeModalAdd} />
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
            <th>Category Name</th>
            <th>Item Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.categoryId}>
              <td><img src={category.imgUrl} alt={category.name} width="600" height="600" /></td>
              <td>{category.name}</td>
              <td>{category.items}</td>
              <td>{category.description}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => openModalUpdate(category)}
                >
                  Update
                </button>

                {/* Modal Update*/}
                {isModalUpdate && (
                  <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Update Category</h5>
                          <button type="button" className="btn-close" onClick={closeModalUpdate}></button>
                        </div>
                        <div className="modal-body">
                          <CategoryUpdate
                            closeModal={closeModalUpdate}
                            category={selectedCategory} // Kirim data kategori ke component
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => deleteByCategoryId(category.categoryId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryList;