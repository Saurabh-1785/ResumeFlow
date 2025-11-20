/**
 * Maps the application state to the resume data structure required by the backend.
 * 
 * @param {Object} state - The application state.
 * @param {Object} state.general - General information.
 * @param {Array} state.education - Education history.
 * @param {Array} state.experience - Work experience.
 * @param {Array} state.projects - Projects.
 * @param {Object} state.skills - Skills.
 * @param {Array} state.customSections - Custom sections.
 * @param {Array} state.sectionOrder - Order of sections.
 * @returns {Object} The formatted data object for the backend.
 */
export const mapStateToResumeData = ({ general, education, experience, projects, skills, customSections, sectionOrder }) => {
    return {
        generalInfo: general,
        education: education.map(e => ({
            school: e.institution,
            location: e.place,
            degree: `${e.study} - ${e.grade}`,
            date: `${e.datestart} -- ${e.dateend}`
        })),
        experience: experience.map(exp => ({
            company: exp.company,
            position: exp.position,
            description: exp.responsibilities,
            date: `${exp.from} -- ${exp.to}`,
            location: ""
        })),
        projects: projects.map(p => ({
            name: p.name,
            tech: p.technology,
            description: p.description,
            link: p.url,
            date: ""
        })),
        skills: skills,
        customSections: customSections,
        sectionOrder: sectionOrder
    };
};
