import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { updateCategory } from "../../service/CategoryService";
import { AppContext } from "../../context/AppContext";

const CategoryUpdate = ({ closeModal, category }) => {
  const { categories, setCategories } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    bgColor: category?.bgColor || "#2c2c2c",
  });
  const [categoryId, setCategoryId] = useState(category?.categoryId || "");

  const onChangehandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (category) {
      setData({
        name: category.name,
        description: category.description,
        bgColor: category.bgColor
      });
      setCategoryId(category.categoryId);
    }
  }, [category]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('category', JSON.stringify(data));
    if (image) {
      formData.append('file', image);
    }

    try {
      const response = await updateCategory(categoryId, formData);
      if (response.status === 200) {
        const updatedCategories = categories.map(cat =>
          cat.categoryId === categoryId ? response.data : cat
        );
        setCategories(updatedCategories);
        toast.success("Category updated");
        closeModal();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-12 form-container">
          <div className="card-body">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Upload
                  <img
                    src={`data:image/jpeg;base64,${image ? URL.createObjectURL(image) : (category?.imgUrl || assets.upload)}`}
                    alt=""
                    width={70}
                  />
                </label>
                <input type="file"
                  name="image"
                  id="image"
                  className="form-control"
                  hidden onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Category Name"
                  onChange={onChangehandler}
                  value={data.name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea rows="5"
                  name="description"
                  id="description"
                  className="form-control"
                  placeholder="Write content here..."
                  onChange={onChangehandler}
                  value={data.description}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bgColor" className="form-label">Background color</label>
                <br />
                <input type="color"
                  name="bgColor"
                  id="bgColor"
                  onChange={onChangehandler}
                  value={data.bgColor}
                />
              </div>
              <button type="submit"
                disabled={loading}
                className="btn btn-warning w-100">{loading ? 'Loading...' : 'Submit'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;