import {
  Building,
  Building2,
  Home,
  LogsIcon,
  LucideClipboardPlus,
  Search,
  Settings,
  SunDim,
  SunDimIcon,
  User2Icon,
  UserRound,
} from "lucide-react";

function SettingsPage() {
  return (
    <section className="SETTING">
      <form action="#" className="container-main col-span-2 min-h-dvh md:45px">
        <div className="form-container">
          <div className="SETTIN">
            <button type="submit">Edit Profile</button>
            <p>Login Information</p>
          </div>
          <h4>Edit Details</h4>
          <label htmlFor="Name" className="editpro">
            First Name (required)
            <input type="text" placeholder="ATO" required />
          </label>
          <label>
            Last Name (required)
            <input type="text" placeholder="ATO" required />
          </label>
          <label htmlFor="#">
            Nickname (required)
            <input type="text" placeholder="Endlesslove" required />
          </label>
          <h5>Login Information</h5>
          <label htmlFor="#">
            Current Password (required)
            <input type="text" />
          </label>
          <label htmlFor="">
            Account Email
            <input
              type="text"
              placeholder="Ag834054@gmail.com ..............."
            />
          </label>
          <label htmlFor="">
            Add your new password
            <input type="text" required />
          </label>
          <label htmlFor="">
            Confirm new password
            <input type="text" required />
          </label>
        </div>
        <button type="button">View all courses</button>
      </form>
    </section>
  );
}

export default SettingsPage;
