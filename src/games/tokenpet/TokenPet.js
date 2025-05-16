/**
 * TokenPet Class - Represents a virtual pet with various states and methods
 * Inspired by classic virtual pet gameplay
 */
class TokenPet {
  /**
   * Create a new pet
   * @param {string} name - The pet's name
   * @param {object} options - Optional configuration
   */
  constructor(name, options = {}) {
    this.name = name;
    this.hunger = options.hunger ?? 20;
    this.happiness = options.happiness ?? 80;
    this.energy = options.energy ?? 100;
    this.health = options.health ?? 100;
    this.age = options.age ?? 0;
    this.createdAt = options.createdAt ?? new Date().toISOString();
    this.lastInteraction = options.lastInteraction ?? new Date().toISOString();
    this.lastSaved = options.lastSaved ?? new Date().toISOString();
    this.stage = options.stage ?? 'egg';
    this.isSleeping = options.isSleeping ?? false;
    this.isSick = options.isSick ?? false;
    this.isDead = options.isDead ?? false;
    this.mood = options.mood ?? this.getMood(); // Add mood property

    this.feedCount = options.feedCount ?? 0;
    this.playCount = options.playCount ?? 0;
    this.medicineCount = options.medicineCount ?? 0;
    this.specialCareCount = options.specialCareCount ?? 0;
    // Evolution thresholds in days
    this.evolutionStages = {
      egg: 0,
      baby: 1,     // 1 day to baby
      child: 3,    // 3 days to child
      teen: 7,     // 7 days to teen
      adult: 14    // 14 days to adult
    };
  }

  feed(amount = 10) {
    if (this.isDead) return { success: false, message: `${this.name} has passed away and cannot be fed.` };
    if (this.isSleeping) return { success: false, message: `${this.name} is sleeping and cannot be fed.` };
    this.lastInteraction = new Date().toISOString();
    this.feedCount++;
    this.hunger = Math.max(0, this.hunger - amount);
    this.happiness = Math.min(100, this.happiness + 5);
    this.health = Math.min(100, this.health + 2);

    this.updateState();
    return { success: true, message: `${this.name} has been fed!` };
  }

  play(amount = 10) {
    if (this.isDead) return { success: false, message: `${this.name} has passed away and cannot play.` };
    if (this.isSleeping) return { success: false, message: `${this.name} is sleeping and cannot play.` };
    if (this.energy < 10) return { success: false, message: `${this.name} is too tired to play!` };
    this.lastInteraction = new Date().toISOString();
    this.playCount++;
    this.happiness = Math.min(100, this.happiness + amount);
    this.energy = Math.max(0, this.energy - 10);
    this.hunger = Math.min(100, this.hunger + 5);

    this.updateState();
    return { success: true, message: `${this.name} had fun playing!` };
  }

  sleep() {
    if (this.isDead) return { success: false, message: `${this.name} has passed away.` };
    this.isSleeping = !this.isSleeping;
    this.lastInteraction = new Date().toISOString();
    if (this.isSleeping) {
      return { success: true, message: `${this.name} is now sleeping.` };
    } else {
      this.energy = Math.min(100, this.energy + 30);
      return { success: true, message: `${this.name} woke up!` };
    }
  }

  medicine() {
    if (this.isDead) return { success: false, message: `${this.name} has passed away.` };
    if (this.isSleeping) return { success: false, message: `${this.name} is sleeping and cannot take medicine.` };
    this.lastInteraction = new Date().toISOString();
    this.medicineCount++;
    this.health = 100;
    this.isSick = false;

    this.updateState();
    return { success: true, message: `${this.name} is feeling much better!` };
  }

  specialCare() {
    if (this.isDead) return { success: false, message: `${this.name} has passed away.` };
    this.lastInteraction = new Date().toISOString();
    this.specialCareCount++;
    this.hunger = Math.max(0, this.hunger - 20);
    this.happiness = 100;
    this.energy = 100;
    this.health = 100;
    this.isSick = false;

    this.updateState();
    return { success: true, message: `${this.name} feels amazing after special care!` };
  }

  updateState(timeFactor = 1) {
    const now = new Date();
    const lastInteraction = new Date(this.lastInteraction);
    const hoursPassed = (now - lastInteraction) / (1000 * 60 * 60);
    if (!this.isSleeping) {
      this.hunger = Math.min(100, this.hunger + (2 * hoursPassed * timeFactor));
      this.happiness = Math.max(0, this.happiness - (2 * hoursPassed * timeFactor));
      this.energy = Math.max(0, this.energy - (1 * hoursPassed * timeFactor));
    } else {
      this.energy = Math.min(100, this.energy + (5 * hoursPassed * timeFactor));
    }
    if (this.hunger > 80 || this.happiness < 20) {
      this.health = Math.max(0, this.health - (2 * hoursPassed * timeFactor));
    }
    this.isSick = this.health < 30;
    if (this.health <= 0) {
      this.isDead = true;
    }
    const daysSinceCreation = (now - new Date(this.createdAt)) / (1000 * 60 * 60 * 24);
    this.age = daysSinceCreation;
    this.updateEvolutionStage();
    this.lastSaved = now.toISOString();
  }

  updateEvolutionStage() {
    if (this.isDead) return;
    if (this.age >= this.evolutionStages.adult) {
      this.stage = 'adult';
    } else if (this.age >= this.evolutionStages.teen) {
      this.stage = 'teen';
    } else if (this.age >= this.evolutionStages.child) {
      this.stage = 'child';
    } else if (this.age >= this.evolutionStages.baby) {
      this.stage = 'baby';
    } else {
      this.stage = 'egg';
    }
    // Update mood when stage changes
    this.mood = this.getMood();
  }

  getStatus() {
    this.updateState();
    return {
      name: this.name,
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      health: this.health,
      age: this.age,
      stage: this.stage,
      isSleeping: this.isSleeping,
      isSick: this.isSick,
      isDead: this.isDead,
      lastInteraction: this.lastInteraction,
      createdAt: this.createdAt,
      mood: this.mood,
      feedCount: this.feedCount,
      playCount: this.playCount,
      medicineCount: this.medicineCount,
      specialCareCount: this.specialCareCount
    };
  }

  getMood() {
    if (this.isDead) return 'deceased';
    if (this.isSleeping) return 'sleeping';
    if (this.isSick) return 'sick';
    if (this.hunger > 80) return 'starving';
    if (this.happiness < 20) return 'depressed';
    if (this.energy < 20) return 'exhausted';
    if (this.happiness > 80 && this.energy > 80) return 'ecstatic';
    if (this.happiness > 60) return 'happy';
    if (this.happiness > 40) return 'content';
    return 'neutral';
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      health: this.health,
      age: this.age,
      createdAt: this.createdAt,
      lastInteraction: this.lastInteraction,
      lastSaved: this.lastSaved,
      stage: this.stage,
      isSleeping: this.isSleeping,
      isSick: this.isSick,
      isDead: this.isDead,
      tokensSpent: this.tokensSpent,
      feedCount: this.feedCount,
      playCount: this.playCount,
      medicineCount: this.medicineCount,
      specialCareCount: this.specialCareCount,
    });
  }

  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new TokenPet(data.name, data);
  }
}

export default TokenPet;
