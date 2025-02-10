import { User } from "../../../types";
import './UserInfo.css';

interface UserInfoProps {
    user: User;
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="user-info-container">
            <div className="user-info-header">
                <div className="user-info-avatar">
                    <img src="/ok.jpg" alt="User avatar" />
                </div>
                <h2>Personal Information</h2>
            </div>
            <div className="user-info-details">
                <div className="user-info-item">
                    <span>Username: {user.username}</span>
                </div>
                <div className="user-info-item">
                    <span>Gender: {user.gender}</span>
                </div>
                <div className="user-info-item">
                    <span>Age: {user.age}</span>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;