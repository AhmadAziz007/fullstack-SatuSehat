import ItemList from '../../components/ItemList/ItemList.jsx';
import './ManageItems.css';

const ManageItems = () => {
  return (
    <div className="items-container text-light">
      <div className="left-column">
        <ItemList />
      </div>
    </div>
  )
}

export default ManageItems;