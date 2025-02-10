import {helper} from "./libs/helper";
import { ROLES } from "./const";
import {userModel} from "./modules/User/model";

export async function seeding(){
    const users = [
        {
            id: helper.getMongoId("67a8de1a7af5105910ffbd16"),
            fullname: "Harry Potter",
            slug: helper.changeToSlug("Harry Potter"),
            email: "admin@gmail.com",
            phone: "0965487293",
            bio: "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends, Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry",
            password: helper.genMd5("Qaz@12345"),
            role: ROLES.ADMIN
        }
    ];

    const data = [
        {
            "language": "da",
            "records": [
                {
                    id: helper.getMongoId("67a9b7a1f1f3e020c9c140ed"),
                    "fullname": "Mikkel Sørensen",
                    "slug": "mikkel-sorensen",
                    "email": "mikkelsorensen@example.dk",
                    "phone": "+4512345678",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "IT-specialist fra København."
                },
                {
                    id: helper.getMongoId("67a9b7a8322a16fad735d69f"),
                    "fullname": "Lars Jensen",
                    "slug": "lars-jensen",
                    "email": "larsjensen@example.dk",
                    "phone": "+4598765432",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Erfaren forretningsudvikler."
                },
                {
                    id: helper.getMongoId("67a9b7af152050371ae6a423"),
                    "fullname": "Kirsten Nielsen",
                    "slug": "kirsten-nielsen",
                    "email": "kirstennielsen@example.dk",
                    "phone": "+4576543210",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Kreativ grafisk designer."
                },
                {
                    id: helper.getMongoId("67a9b7b7434e862aaf0b598a"),
                    "fullname": "Hans Pedersen",
                    "slug": "hans-pedersen",
                    "email": "hanspedersen@example.dk",
                    "phone": "+4556781234",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Ekspert inden for digital marketing."
                },
                {
                    id: helper.getMongoId("67a9b7bc0a851e21c003577c"),
                    "fullname": "Marie Hansen",
                    "slug": "marie-hansen",
                    "email": "mariehansen@example.dk",
                    "phone": "+4523456789",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Kommunikationsekspert og forfatter."
                }
            ]
        },
        {
            "language": "nl",
            "records": [
                {
                    id: helper.getMongoId("67a9b7c3fe205588abc51c85"),
                    "fullname": "Jan de Vries",
                    "slug": "jan-de-vries",
                    "email": "jandevries@example.nl",
                    "phone": "+31123456789",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Softwareontwikkelaar uit Amsterdam."
                },
                {
                    id: helper.getMongoId("67a9b7c912bf668ca0be1bcd"),
                    "fullname": "Piet Jansen",
                    "slug": "piet-jansen",
                    "email": "pietjansen@example.nl",
                    "phone": "+31987654321",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "E-commerce expert en ondernemer."
                },
                {
                    id: helper.getMongoId("67a9b7cefb17b92893a5245a"),
                    "fullname": "Sanne de Boer",
                    "slug": "sanne-de-boer",
                    "email": "sannedeboer@example.nl",
                    "phone": "+31654321234",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Contentcreator met een passie voor verhalen."
                },
                {
                    id: helper.getMongoId("67a9b7d6042313941dd648ee"),
                    "fullname": "Kees van Dam",
                    "slug": "kees-van-dam",
                    "email": "keesvandam@example.nl",
                    "phone": "+31198765432",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Financieel adviseur met 15 jaar ervaring."
                },
                {
                    id: helper.getMongoId("67a9b7db4ffaba26cbc88393"),
                    "fullname": "Lisa Bakker",
                    "slug": "lisa-bakker",
                    "email": "lisabakker@example.nl",
                    "phone": "+31765432123",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Digitale marketeer en blogger."
                }
            ]
        },
        {
            "language": "es",
            "records": [
                {
                    id: helper.getMongoId("67a9b7e16aa24443a912b83d"),
                    "fullname": "Carlos García",
                    "slug": "carlos-garcia",
                    "email": "carlosgarcia@example.es",
                    "phone": "+34123456789",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Desarrollador de software de Madrid."
                },
                {
                    id: helper.getMongoId("67a9b7e6455edfdcaa390bb9"),
                    "fullname": "María Fernández",
                    "slug": "maria-fernandez",
                    "email": "mariafernandez@example.es",
                    "phone": "+34987654321",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Diseñadora gráfica apasionada por la creatividad."
                },
                {
                    id: helper.getMongoId("67a9b7ec18f2688c76ae0cac"),
                    "fullname": "Pedro Sánchez",
                    "slug": "pedro-sanchez",
                    "email": "pedrosanchez@example.es",
                    "phone": "+34654321987",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Consultor de negocios."
                },
                {
                    id: helper.getMongoId("67a9b7f172a30cfbd54c8b7d"),
                    "fullname": "Lucía López",
                    "slug": "lucia-lopez",
                    "email": "lucialopez@example.es",
                    "phone": "+34198765432",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Especialista en marketing digital."
                },
                {
                    id: helper.getMongoId("67a9b7f6fa07bb275d70cb7b"),
                    "fullname": "Javier Martín",
                    "slug": "javier-martin",
                    "email": "javiermartin@example.es",
                    "phone": "+34567812345",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Desarrollador full stack."
                }
            ]
        },
        {
            "language": "en",
            "records": [
                {
                    id: helper.getMongoId("67a9b800ad569e4f28452d04"),
                    "fullname": "John Doe",
                    "slug": "john-doe",
                    "email": "johndoe@example.com",
                    "phone": "+11234567890",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Passionate software engineer from California."
                },
                {
                    id: helper.getMongoId("67a9b8063a2859ed6c94abf1"),
                    "fullname": "Jane Smith",
                    "slug": "jane-smith",
                    "email": "janesmith@example.com",
                    "phone": "+11234567891",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Creative graphic designer with a love for visuals."
                },
                {
                    id: helper.getMongoId("67a9b80eddbe24afa8d565b4"),
                    "fullname": "Alice Johnson",
                    "slug": "alice-johnson",
                    "email": "alicejohnson@example.com",
                    "phone": "+11234567892",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Content writer and marketing strategist."
                },
                {
                    id: helper.getMongoId("67a9b81315dcb1614b58f548"),
                    "fullname": "Michael Brown",
                    "slug": "michael-brown",
                    "email": "michaelbrown@example.com",
                    "phone": "+11234567893",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Sales expert with 10 years of experience."
                },
                {
                    id: helper.getMongoId("67a9b8183bf1eced349ef241"),
                    "fullname": "David Miller",
                    "slug": "david-miller",
                    "email": "davidmiller@example.com",
                    "phone": "+11234567894",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Innovative entrepreneur and business coach."
                }
            ]
        },
        {
            "language": "fr",
            "records": [
                {
                    id: helper.getMongoId("67a9b81f2f30224cb617f160"),
                    "fullname": "Jean Dupont",
                    "slug": "jean-dupont",
                    "email": "jeandupont@example.fr",
                    "phone": "+33123456789",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Ingénieur passionné de technologie à Paris."
                },
                {
                    id: helper.getMongoId("67a9b8255b5db3a413862893"),
                    "fullname": "Marie Curie",
                    "slug": "marie-curie",
                    "email": "mariecurie@example.fr",
                    "phone": "+33123456788",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Scientifique renommée dans le domaine de la physique."
                },
                {
                    id: helper.getMongoId("67a9b82a05cb3c15c665c3cb"),
                    "fullname": "Luc Martin",
                    "slug": "luc-martin",
                    "email": "lucmartin@example.fr",
                    "phone": "+33123456787",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Consultant en marketing digital."
                },
                {
                    id: helper.getMongoId("67a9b82e5af65a939f1c571a"),
                    "fullname": "Élodie Laurent",
                    "slug": "elodie-laurent",
                    "email": "elodielaurent@example.fr",
                    "phone": "+33123456786",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Designeuse graphique à Bordeaux."
                },
                {
                    id: helper.getMongoId("67a9b834806ae36c83909926"),
                    "fullname": "Nicolas Petit",
                    "slug": "nicolas-petit",
                    "email": "nicolaspetit@example.fr",
                    "phone": "+33123456785",
                    password: helper.genMd5("Qaz@12345"),
                    role: ROLES.MEMBER,
                    "bio": "Chef de projet expérimenté."
                }
            ]
        }
    ];

    for(const user of users){
        const exists = await userModel.exists({ _id: user.id });
        if(!exists) await userModel.create(user);
    }

    for(const item of data){
        for(const record of item.records){
            const exists = await userModel.exists({ _id: record.id });
            if(!exists) await userModel.create({ ...record, language: item.language });
        }
    }

    console.log("SEEDING OKI!")
    return true;
}