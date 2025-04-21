import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { updateItems } from "../../service/ItemsService";
import { assets } from "../../assets/assets";

const ItemsUpdate = ({ closeModal, items }) => {
  const { categories, itemsData, setItemsData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: items?.name || "",
    description: items?.description || "",
    price: items?.price || "",
    categoryId: items.categoryId || ""
  });
  const [itemsId, setItemsId] = useState(items?.itemsid || "");

  const onChangehandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (items) {
      setData({
        name: items.name,
        description: items.description,
        price: items.price,
        categoryId: items.categoryId
      });
      setItemsId(items.itemsId);
    }
  }, [items]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fromData = new FormData();
    fromData.append('item', JSON.stringify(data));
    if (image) {
      fromData.append('file', image);
    }

    try {
      const response = await updateItems(itemsId, fromData);
      if (response.status === 200) {
        const updateItems = itemsData.map(item =>
          item.itemsId === itemsId ? response.data : item
        );
        setItemsData(updateItems);
        toast.success("Items updated successfully");
        closeModal();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating items");
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
                  <img src={image ? URL.createObjectURL(image) : (assets.imgUrl || assets.upload)}
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
                <label htmlFor="category" className="form-label">Category</label>
                <select name="categoryId" id="category" className="form-control" onChange={onChangehandler} value={data.categoryId}>
                  <option value="">--SELECT CATEGORY--</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.categoryId}>{category.name}</option>
                  ))}
                </select>
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
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number"
                  name="price"
                  id="price"
                  className="form-control"
                  placeholder="000.00"
                  onChange={onChangehandler}
                  value={data.price}
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

export default ItemsUpdate;