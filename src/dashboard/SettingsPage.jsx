import {} from /* icons */ "lucide-react";

function SettingsPage() {
  return (
    <section className="SETTING">
      <form className="container-main col-span-2 min-h-dvh md:45px">
        <div className="form-container">
          <div className="SETTIN">
            <button type="onSubmit">Edit Profile</button>
            <p>Login Information</p>
          </div>
          <h4>Edit Details</h4>
          <label htmlFor="First-Name" className="editpro">
            First Name (required)
            <input type="text" placeholder="ATO" id="First-Name" required />
          </label>
          <label htmlFor="Last-Name">
            Last Name (required)
            <input type="text" placeholder="ATO" id="Last-Name" required />
          </label>
          <label htmlFor="Nickname">
            Nickname (required)
            <input
              type="text"
              placeholder="Endlesslove"
              id="Nickname"
              required
            />
          </label>
          <fieldset>
            <legend>
              <h5>Login Information</h5>
            </legend>
            <label htmlFor="Current-Password">
              Current Password (required)
              <input
                type="password"
                id="Current-Password"
                placeholder="Current Password" autoComplete="off"
              />
            </label>
            <label htmlFor="Account-Email">
              Account Email
              <input
                type="email"
                id="Account-Email"
                placeholder="Ag834054@gmail.com"
              />
            </label>
            <label htmlFor="new-password">
              Add your new password
              <input
                type="password"
                placeholder="Add your new password"
                id="new-password"
                required
              />
            </label>
            <label htmlFor="Confirm-new-password">
              Confirm new password
              <input
                type="password"
                required
                id="Confirm-new-password"
                placeholder="Confirm new password"
              />
            </label>
          </fieldset>
        </div>
      </form>
      <button>Update Profile</button>
    </section>
  );
}

export default SettingsPage;
