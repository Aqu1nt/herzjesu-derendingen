import {Service, Inject} from "ng-next"

@Service("PersonModalService")
class PersonModalService
{

    @Inject $uibModal;

    /**
     * The current modal instance
     */
    modal = null;

    show(person = null)
    {
        this.modal = this.$uibModal.open({
            templateUrl : "/views/common/person-modal.html",
            controller : PersonModalController,
            controllerAs : "modalCtrl",
            resolve : {
                person : () => person
            }
        });

        return this.modal.result;
    }
}


class PersonModalController
{
    @Inject $scope;

    @Inject toastr;

    /**
     * @type {PersonService}
     */
    @Inject PersonService;

    @Inject person;

    create = true;

    DEFAULT_PERSON = {
        fields : "",
        title : "",
        image : null
    };

    creatingPerson = false;
    deletingPerson = false;

    constructor()
    {
        this.create = !this.person;
        this.person = !!this.person ? Object.assign({}, this.person) : this.DEFAULT_PERSON;
    }


    async deletePerson()
    {
        try {
            this.deletingPerson = true;
            await this.PersonService.deletePerson(this.person);
            this.$scope.$close();
            this.toastr.success("Person wurde gelöscht");
        }
        catch (e) {
            console.error(e);
            this.toastr.error("Person konnte nicht gelöscht werden!");
        }
        finally {
            this.deletingPerson = false;
        }
    }

    async submit()
    {
        if (this.person.image != null)
        {
            this.person.imageBase64 = await this.toBase64(this.person.image);
            let name = this.person.image.name;
            this.person.imageExt = name.substring(name.lastIndexOf(".") + 1);
        }

        try
        {
            this.creatingPerson = true;
            let result = await this.PersonService.store(this.person, !this.create);
            this.$scope.$close(result);
            this.toastr.success("Die Person wurde erfolgreich erstellt");
        }
        catch (e)
        {
            console.error(e);
            this.toastr.error("Die Person konnte nicht gespeichert werden!");
        }
        finally
        {
            this.creatingPerson = false;
        }
    }

    async delete()
    {

    }

    async toBase64(file)
    {
        return new Promise(resolve => {
            if (file == null) resolve(file);
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                resolve(reader.result.substring(reader.result.indexOf(",") + 1));
            }, false);
            reader.readAsDataURL(file);
        });
    }
}