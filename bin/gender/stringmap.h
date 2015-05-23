#ifndef STRINGMAP_H
#define STRINGMAP_H

#include <vector>

const size_t MAX_ALLOWED_TABLE_SIZE = 2000;

template <typename T>
/**
 * A fast, simple and dumb hash map that only supports insertion and lookups.
 * The only reason this exists is for me to practice some C++.
 */
class ConstantSizeStringMap
{
typedef std::pair<std::string, T> Entry;
typedef std::vector<Entry> HashChain;
public:
    ConstantSizeStringMap(const size_t capacity, const T missingValue)
    {
        this->missingValue = missingValue;
        this->hash = std::hash<std::string>();
        this->table = std::vector<HashChain>(std::min<size_t>(capacity, MAX_ALLOWED_TABLE_SIZE));
        for (int index = 0; index < capacity; index++)
            this->table.push_back(HashChain());
    }

    void insert(const std::string key, const T value)
    {
        size_t index = hash(key) % table.capacity();
        table[index].push_back(Entry(key, value));
    }

    T get(const std::string key)
    {
        HashChain chain = table[hash(key) % table.capacity()];

        for (int iter = 0; iter < chain.size(); iter++) {
            Entry entry = chain[iter];
            if (entry.first == key)
                return entry.second;
        }
        return missingValue;
    }

private:
    std::vector<HashChain> table;
    std::hash<std::string> hash;
    T missingValue;
};

#endif
