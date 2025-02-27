import Services.Extern.Conection as cx
import BE.Classes.User as User
import Sp

class Mpp_User:
    def __init__(self):
        pass
    def get_user(Email):
        try:
            conn = cx.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users WHERE Email = {Email}")
            usr = User(cursor["Id"], cursor["Email"], cursor["Password"])
            return usr
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
        return None

    def new_user(usr):
        try:
            conn = cx.get_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO Users (Email, Password) VALUES ({usr.Email}, {usr.Password})")
            conn.commit()
            return True
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
        return False

    def update_user(usr):
        try:
            conn = cx.get_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE Users SET Email = {usr.Email}, Password = {usr.Password} WHERE Id = {usr.Id}")
            conn.commit()
            return True
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
        return False

    def delete_user(usr):
        try:
            conn = cx.get_connection()
            cursor = conn.cursor()
            sp = Sp.StoredProcedures_User["Delete_User"]
            cursor.execute("EXEC {sp}",usr.Id)
            conn.commit()
            return True
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
        return False