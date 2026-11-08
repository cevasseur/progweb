import Contact from '../models/contactModel.js';

// Get all contacts
export async function getAllContacts() {
    let total = await Contact.countDocuments({});
    let limit = parseInt(total);

    try {
        const contacts = await Contact.find().limit(limit);
        return {
            success: true,
            data: contacts,
            total: total.toString(),
        }
    } catch (err) {
        return { success: false, message: "Contacts not found " + err };
    }
}

// Get contact by Id
export async function getContactById(id) {
    try {
        const contact = await Contact.findOne({ _id: id });
        return {
          success: true,
          data: contact,
          total: (1).toString(),
        }
    } catch (err) {
      return { success: false, message: "Contact not found " + err };
    }
}

// Add a new contact, returns the added contact
export async function addContact(body) {
    try {
        const contact = await Contact.create(body);
        return {
          success: true,
          data: contact,
          total: (1).toString(),
        }
    } catch (err) {
      return { success: false, message: "Contact not created " + err };
    }
}
 
// Update an existing contact
export async function updateContact(id, name = null, age = null) {
    try {
      const oldContact = await Contact.findById(id);
      if (!oldContact) return { success: false, message: "Contact not found for update" };
      
      const updatedName = (name !== null && name !== undefined) ? name : oldContact.name;
      const updatedAge = (age !== null && age !== undefined) ? age : oldContact.age;

      const contact = await Contact.updateOne(
          { _id: id },
          { name: updatedName },
          { age: updatedAge },
      );

      return {
        success: true,
        data: contact,
        total: (1).toString(),
      }
    } catch (err) {
      return { success: false, message: "Contact not updated " + err };
    }
}
    
// Remove an existing contact
export async function removeContact(id) {
    try {
      const result = await Contact.deleteOne({ _id: id });

      if (!result.deletedCount)
        return { success: false, message: "Nothing deleted" };

      return {
        success: true,
        data: result,
        total: result.deletedCount.toString(),
      };
    } catch (err) {
      return { success: false, message: "Contact not deleted " + err };
    }
}
