ESX = exports["es_extended"]:getSharedObject()
while not ESX do Citizen.Wait(10) ESX = exports["es_extended"]:getSharedObject() end

-- Inicjalizacja lib (dla ox_lib)
if not lib then
    lib = exports.ox_lib
end

cache.player.vehicleManager = {
    inVehicle = false,
    vehicle = nil,
    vehicleSpeed = 0,
    vehicleRpm = 0,
    street = '',
    district = '',
    direction = '',
    gear = ''
}

local directions = { [0] = 'N', [45] = 'NW', [90] = 'W', [135] = 'SW', [180] = 'S', [225] = 'SE', [270] = 'E', [315] = 'NE', [360] = 'N', }
local vehicleManager = cache.player.vehicleManager

--@param value number @ used for RPM turnover bar in NEWHUD
--@return percentage number @ Percentage of the @value on a scale of 0-100
local function convertToPercentage(value)
    return math.ceil(value * 10000 - 2001) / 80
end

--@param vehicleClass number Vehicle class assigned to vehicle
--@return rpm scale @ used for GTAHUD
local function calculateRpmScale(vehicleClass)
    local scale = 0
    if (vehicleClass >= 0 and vehicleClass <= 5) then
        scale = 7000
    elseif (vehicleClass == 6) then
        scale = 7500
    elseif (vehicleClass == 7) then
        scale = 8000
    elseif (vehicleClass == 8) then
        scale = 11000
    elseif (vehicleClass == 15 or vehicleClass == 16) then
        scale = -1
    end

    return scale
end

--@param gear number Gear of vehicle
--@return actual gear @ checking if player is driving backwards so it can return R and not 0
local function getVehRightGear(gear)
    if (gear == 0 and (vehicleManager.vehicleSpeed or 0) > 5) then
        return 'R'
    else
        return gear
    end
end

local function updateCarhud(key, val)
    local data = {
        action = 'updateCarhud'
    }
    data[key] = val
    SendNUIMessage(data)
end

local function startLocationThread()
    while vehicleManager.inVehicle do
        local coords = GetEntityCoords(cache.player.ped)
        local locationHash, locationHash2 = Citizen.InvokeNative(0x2EB41072B4C1E4C0, coords.x, coords.y, coords.z, Citizen.PointerValueInt(), Citizen.PointerValueInt())
        vehicleManager.street = GetStreetNameFromHashKey(locationHash)
        vehicleManager.district = GetStreetNameFromHashKey(locationHash2)
        vehicleManager.zone = config.zones[GetNameOfZone(coords.x, coords.y, coords.z)]
        for k,v in pairs(directions) do
            local estHeading = math.abs(GetEntityHeading(cache.player.ped) - k)
            if (estHeading < 22.5) then
                vehicleManager.direction = v
            end
        end
        updateCarhud('direction', vehicleManager.direction)
        updateCarhud('street', vehicleManager.street)
        updateCarhud('district', {
            district = vehicleManager.district,
            zone = vehicleManager.zone
        })
        Wait(500)
    end
end

local function startCarhudThread()
    CreateThread(startLocationThread)
    updateCarhud('isInVehicle', true)
    vehicleManager.vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    while vehicleManager.inVehicle do
            vehicleManager.vehicleSpeed = math.ceil(GetEntitySpeed(vehicleManager.vehicle) * 3.6) or 0
            vehicleManager.rpm = GetVehicleCurrentRpm(vehicleManager.vehicle)
            
            -- Add fuel level handling
            local fuel = GetVehicleFuelLevel(vehicleManager.vehicle)
            local fuelCapacity = GetVehicleHandlingFloat(vehicleManager.vehicle, 'CHandlingData', 'fPetrolTankVolume')
            local fuelPercent = (fuel / fuelCapacity) * 100

            updateCarhud('gear', getVehRightGear(GetVehicleCurrentGear(vehicleManager.vehicle)))
            local rpmScale = calculateRpmScale(vehicleManager.rpm)
            updateCarhud('speed', vehicleManager.vehicleSpeed)
            updateCarhud('tunrover', convertToPercentage(vehicleManager.rpm))
            updateCarhud('rpm', math.floor(vehicleManager.rpm * rpmScale))
            updateCarhud('fuel', fuelPercent)
        Wait(50)
    end

    updateCarhud('isInVehicle', false)
end

--@param vehicle number Entity handle of vehicle
local function updatePlayerVehicle(vehicle)
    SetBigmapActive(false, true)
    vehicleManager.vehicle = vehicle
    vehicleManager.inVehicle = true
    CreateThread(startCarhudThread)
    DisplayRadar(true)
end

local function removePlayerVehicle()
    vehicleManager.vehicle = nil
    vehicleManager.inVehicle = false
    updateCarhud('isInVehicle', false)
    DisplayRadar(false)
end

CreateThread(function()
    repeat Wait(1)
    until ESX.IsPlayerLoaded()
    Wait(3000)
    if (IsPedInAnyVehicle(PlayerPedId(), false)) then
        updatePlayerVehicle(GetVehiclePedIsIn(PlayerPedId()))
    else
        removePlayerVehicle()
    end
end)

-- RegisterNetEvent('esx:enteredVehicle', updatePlayerVehicle)
-- RegisterNetEvent('esx:exitedVehicle', removePlayerVehicle)
if lib and lib.onCache then
    lib.onCache('vehicle', function(value)
        if value then
            updatePlayerVehicle()
        else
            removePlayerVehicle()
        end
    end)
end