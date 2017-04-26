import {Controller, Inject, Init} from "ng-next"

@Controller("PeopleSectionController")
export class PeopleSectionController
{
    /**
     * @type {PersonModalService}
     */
    @Inject PersonModalService;

    @Inject PersonService;

    persons = [];

    @Init
    async loadPersons()
    {
        this.persons = await this.PersonService.all();
    }

    async newPerson()
    {
        let createdPerson = await this.PersonModalService.show();
        this.loadPersons();
    }

    async edit(person)
    {
        let updatedPerson = await this.PersonModalService.show(person);
        this.loadPersons();
    }
}