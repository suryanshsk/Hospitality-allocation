const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { parse } = require('json2csv');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const allocateRooms = (groups, hostels) => {
    const allocations = [];
    const remainingCapacity = {};

    hostels.forEach(({ 'Hostel Name': hostelName, 'Room Number': roomNumber, Capacity, Gender }) => {
        remainingCapacity[`${hostelName}-${roomNumber}`] = { capacity: Number(Capacity), gender: Gender.toLowerCase(), occupants: [] };
    });

    groups.forEach(({ 'Group ID': groupID, Members, Gender }) => {
        let remainingMembers = Number(Members);
        const groupGender = Gender.toLowerCase();

        for (const room in remainingCapacity) {
            const { capacity, gender, occupants } = remainingCapacity[room];
            if (groupGender === gender && remainingMembers <= capacity - occupants.length) {
                occupants.push({ groupID, members: remainingMembers });
                remainingCapacity[room].occupants = occupants;
                remainingMembers = 0;
                break;
            }
        }

        if (remainingMembers > 0) {
            for (const room in remainingCapacity) {
                const { capacity, gender, occupants } = remainingCapacity[room];
                if (groupGender === gender && remainingMembers > 0) {
                    const availableSpace = capacity - occupants.length;
                    if (availableSpace > 0) {
                        const allocated = Math.min(availableSpace, remainingMembers);
                        occupants.push({ groupID, members: allocated });
                        remainingCapacity[room].occupants = occupants;
                        remainingMembers -= allocated;
                    }
                }
            }
        }
    });

    for (const room in remainingCapacity) {
        remainingCapacity[room].occupants.forEach(({ groupID, members }) => {
            const [hostelName, roomNumber] = room.split('-');
            allocations.push({ groupID, hostelName, roomNumber, membersAllocated: members });
        });
    }

    return allocations;
};

const handleFileUpload = async (req, res) => {
    try {
        const groupFile = req.files[0].path;
        const hostelFile = req.files[1].path;

        const groups = await parseCSV(groupFile);
        const hostels = await parseCSV(hostelFile);

        const allocations = allocateRooms(groups, hostels);
        const csv = parse(allocations, { fields: ['groupID', 'hostelName', 'roomNumber', 'membersAllocated'] });

        const outputPath = path.join(__dirname, '..', 'uploads', 'allocations.csv');
        fs.writeFileSync(outputPath, csv);

        res.download(outputPath);
    } catch (error) {
        res.status(500).send({ error: 'Error processing files' });
    }
};

module.exports = { handleFileUpload };
