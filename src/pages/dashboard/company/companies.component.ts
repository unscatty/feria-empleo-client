import ICompany from '@/models/company/company.interface';

export class AdminCompaniesComponent {
  currentPosition: ICompany = null;
  dialog = false;
  loadingTable = false;
  deleteDialog = false;
  updating = false;
  loading = false;
  headers = [
    {
      text: 'Nombre',
      align: 'center',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Imagen',
      align: 'center',
      sortable: false,
      value: 'imageURL',
    },
    {
      text: 'Email (Invitación)',
      align: 'center',
      sortable: false,
      value: 'invitationEmail',
    },
    {
      text: 'Email (Activo)',
      align: 'center',
      sortable: false,
      value: 'activeEmail',
    },
    {
      text: 'Descripción',
      align: 'center',
      sortable: false,
      value: 'description',
    },
    {
      text: 'Staff',
      align: 'center',
      sortable: false,
      value: 'staff',
    },
    {
      text: 'Total vacantes',
      align: 'center',
      sortable: false,
      value: 'jobPosts.length',
    },
    {
      text: 'Acciones',
      align: 'center',
      sortable: false,
      value: 'actions',
      class: 'text-center',
    },
  ];
  options = {};

  editCompany(company: any) {
    this.currentPosition = company;
    this.dialog = true;
    this.updating = true;
  }
  openDeleteDialog(company: any) {
    this.currentPosition = company;
    this.deleteDialog = true;
  }
}
